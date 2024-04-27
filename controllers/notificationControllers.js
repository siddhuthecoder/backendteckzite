import Notification from "../models/notificationModel.js";
import NodeCache from "node-cache";

// Create a new cache instance with a TTL of 3600 seconds (1 hour)
const notificationCache = new NodeCache({ stdTTL: 3600 });

export const newNotification = async (req, res) => {
  try {
    const { heading, info, picturePath, link } = req.body;

    const notification = await Notification.create({
      heading,
      info,
      picturePath,
      link,
    });

    // Clear the cache after adding a new notification
    notificationCache.del("notifications");

    return res.status(200).json({ notification });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const editNotification = async (req, res) => {
  const { id } = req.params;
  const { heading, info, picturePath, link } = req.body;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(id, {
      heading,
      info,
      picturePath,
      link,
    });

    // Clear the cache after editing a notification
    notificationCache.del("notifications");

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const del = await Notification.findByIdAndDelete(id);
    if (!del) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Clear the cache after deleting a notification
    notificationCache.del("notifications");

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const fetchNotification = async (req, res) => {
  try {
    let notifications = notificationCache.get("notifications");
    if (!notifications) {
      notifications = await Notification.find().sort({ createdAt: 1 });
      notificationCache.set("notifications", notifications);
    }

    return res.status(200).json({ notifications: notifications.reverse() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const fetchNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    return res.status(200).json({ notification });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
