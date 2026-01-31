const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return res.status(400).json({ message: 'Email already subscribed' });
            } else {
                // Reactivate
                existingSubscriber.status = 'active';
                await existingSubscriber.save();
                return res.status(200).json({ message: 'Subscription reactivated successfully' });
            }
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscription error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
