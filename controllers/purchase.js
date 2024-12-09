const Razorpay = require('razorpay');
const Order = require('../models/orders');
require('dotenv').config();

exports.purchasePremium = (req, res) => {
    const rzp = new Razorpay({
        key_id: process.env.RZP_KEY_ID,
        key_secret: process.env.RZP_KEY_SECRET
    });
    const amount = 2500;
    const razorpayPromise = rzp.orders.create({ amount, currency: 'INR' });
    const orderCreationPromise = razorpayPromise.then(order =>
        req.user.createOrder({ orderId: order.id, status: 'PENDING' })
    );

    Promise.all([razorpayPromise, orderCreationPromise])
        .then(([razorpayOrder]) => {
            res.status(201).json({ order: razorpayOrder, key_id: rzp.key_id });
        })
        .catch(error => {
            console.error("Error during premium purchase:", error);
            res.status(500).json({ message: 'Something went wrong', error });
        });
};

exports.updateTransactionStatus = (req, res) => {
    const { payment_id, order_id, status } = req.body;

    Order.findOne({ where: { orderId: order_id } })
        .then(order => {
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            const updateFields = status === 'FAILED'
                ? { status: 'FAILED' }
                : { paymentId: payment_id, status: 'SUCCESSFUL' };

            const orderUpdatePromise = order.update(updateFields);

            if (status === 'FAILED') {
                return orderUpdatePromise
                    .then(() => res.status(202).json({ success: false, message: 'Transaction Failed' }));
            }

            const userUpdatePromise = req.user.update({ isPremiumUser: true });

            return Promise.all([orderUpdatePromise, userUpdatePromise])
                .then(() => res.status(202).json({ success: true, message: 'Transaction Successful' }))
                .catch(error => {
                    console.error("Error during updates:", error);
                    res.status(500).json({ message: 'Something went wrong', error });
                });
        })
        .catch(error => {
            console.error("Error finding order:", error);
            res.status(500).json({ message: 'Something went wrong', error });
        });
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};