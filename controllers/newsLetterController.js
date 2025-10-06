import NewsLetter from "../models/newsLetterModel.js";

export async function createSubscription(req, res) {
  try {
    const { email } = req.body;
    const newSubscription = new NewsLetter({ email });
    await newSubscription.save();
    res.status(201).json({ message: "Subscription created successfully" });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getSubscriptions(req, res) {
  try {
    const subscriptions = await NewsLetter.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
}
export async function updateSubscriptionStatus(req, res) {
  try {
    const { id } = req.params

    const updatedSubscription = await NewsLetter.findById(id);
    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    updatedSubscription.status = updatedSubscription.status === 'Subscribed' ? 'Unsubscribed' : 'Subscribed';
    await updatedSubscription.save();

    res.status(200).json(updatedSubscription);
    
  } catch (error) {
    console.error("Error updating subscription status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteSubscription(req, res) {
  try {
    const { id } = req.params;
    const deletedSubscription = await NewsLetter.findByIdAndDelete(id);
    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSubscriptionById(req, res) {
  try {
    const { id } = req.params;
    const subscription = await NewsLetter.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}