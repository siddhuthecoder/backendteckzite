import Workshop from "../models/workshopModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const newWorkshopUpload = async (req, res) => {
  try {
    const {
      name,
      dep,
      about,
      workshopImg,
      structure,
      entryFee,
      contact,
      instructorName,
      instructorSpecifications,
      instructorImage,
    } = req.body;

    const newWorkshop = new Workshop({
      name,
      dep,
      about,
      workshopImg,
      structure,
      entryFee,
      contact,
      instructorName,
      instructorSpecifications,
      instructorImage,
      regStudents: [],
    });

    const savedWorkshop = await newWorkshop.save();
    res.status(201).json(savedWorkshop);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const fetchAllWorkshops = async (req, res) => {
  try {
    const allWorkshops = await Workshop.find();

    res.status(200).json(allWorkshops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchWorkshopById = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      dep,
      about,
      workshopImg,
      structure,
      entryFee,
      contact,
      instructorName,
      instructorSpecifications,
      instructorImage,
    } = req.body;

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      id,
      {
        name,
        dep,
        about,
        workshopImg,
        structure,
        contact,
        entryFee,
        instructorName,
        instructorSpecifications,
        instructorImage,
      },
      { new: true }
    );

    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(updatedWorkshop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWorkshop = async (req, res) => {
  const { id } = req.params;
  try {
    const del = await Workshop.findByIdAndDelete(id);
    if (!del) {
      return res.status(400).json({ errro: "No Workshop found" });
    }
    return res.status(200).json({ message: "Deleted Succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
};

export const registerWorkshop = async (req, res) => {
  const { id } = req.params;
  const { name, email, phno, college, idNumber } = req.body;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user_id = decodedToken.userId;

    const workshop = await Workshop.findOneAndUpdate(
      { _id: id, "regStudents.email": { $ne: email } },
      {
        $push: {
          regStudents: {
            name,
            email,
            phno,
            college,
            idNumber,
          },
        },
      },
      { new: true }
    );

    if (!workshop) {
      return res
        .status(400)
        .json({ message: "User already registered for this workshop" });
    }

    await User.findByIdAndUpdate(user_id, {
      $push: { regWorkshop: workshop._id },
    });
    return res.status(200).json({ message: "User Registration Successfully" });
  } else {
    const workshop = await Workshop.findOneAndUpdate(
      { _id: id, "regStudents.email": { $ne: email } },
      {
        $push: {
          regStudents: {
            name,
            email,
            phno,
            college,
            idNumber,
          },
        },
      },
      { new: true }
    );

    if (!workshop) {
      return res
        .status(400)
        .json({ message: "User already registered for this workshop" });
    }

    return res.status(200).json({ message: "User Registration Successfully" });
  }
};
