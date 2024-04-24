import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { instance } from "../index.js";
import crypto from "crypto";
import SignUser from "../models/signUserModel.js";
import { log } from "console";
import nodemailer from 'nodemailer'

export const loginUser = async (req, res) => {
  const { email, sub } = req.body;

  try {
    const user = await User.findOne({ email })
      .populate({
        path: "regEvents",
        select: "img name _id",
      })
      .populate({
        path: "regWorkshop",
        select: "workshopImg name _id",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(sub, user.sub);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Attempt to login" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    firstName,
    amountPaid,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
    gender,
    img,
    state,
    district,
    idUpload,
    city,
  } = req.body;

  try {
    const sub = await bcrypt.hash(email, 12);
    const user = await User.findOneAndUpdate(
      { tzkid: id },
      {
        email,
        firstName,
        lastName,
        college,
        amountPaid,
        sub,
        phno,
        year,
        branch,
        collegeId,
        gender,
        img,
        state,
        district,
        idUpload,
        city,
      }
    );

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    return res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res) => {
  const {
    email,
    firstName,
    amountPaid,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
    gender,
    img,
    state,
    district,
    idUpload,
    city,
    mode,
    referredBy,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!mode) {
      return res.status(400).json({ error: "Mode Error" });
    }
    if (mode !== "offline_mode") {
      if (!razorpay_order_id) {
        return res.status(400).json({ error: "Payment Check Error" });
      }
    }

    const sub = await bcrypt.hash(email, 12);
    const user = await User.create({
      email,
      firstName,
      lastName,
      college,
      amountPaid,
      phno,
      year,
      branch,
      collegeId,
      gender,
      img,
      state,
      district,
      idUpload,
      sub,
      city,
      referredBy,
      mode,
    });

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // const ref = await User.findOneAndUpdate(
    //   { tzkid: referredBy.toLowerCase() },
    //   { $push: { refreals: user.tzkid } }
    // );

    // if (!ref) {
    //   return res.status(200).json({
    //     token,
    //     user,
    //     message: "Registration Succesful\nReferral was not valid",
    //   });
    // }
     //send mail
    //  console.log("Teckzite ID:", user.tzkid);
     const teckziteId = user.tzkid;
  
     
     await sendemail(
    user
     )


    return res
      .status(200)
      .json({ user, token, message: "Registration Succesful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ tzkid: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUser = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "regEvents",
        select: "img name _id",
      })
      .populate({
        path: "regWorkshop",
        select: "workshopImg name _id",
      });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createOrder = async (req, res) => {
  const {
    email,
    amount,
    firstName,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
  } = req.body;

  const domainPattern =
    /^(r|n|s|o|ro)[0-9]{6}@(rguktn|rguktong|rguktsklm|rguktrkv)\.ac\.in$/;

  const signUser = await SignUser.create({
    email,
    firstName,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
  });

  if (!signUser) {
    return res.status(500).json({ message: "Check your internet connection" });
  }

  let ramount = amount;
  if (domainPattern.test(email)) {
    ramount = Number(process.env.FEE_RGUKT);
  } else {
    ramount = Number(process.env.FEE_OUTSIDERS);
  }

  const order = await instance.orders.create({
    amount: Number(ramount * 100),
    currency: "INR",
  });

  if (!order.id) {
    res.status(200).send({ status: "Failure" });
  }
  res.status(200).send({ order, status: "success" });
};

export const paymentVerification = async (req, res) => {
  const {
    razorpay_payment_id,
    order_id,
    amount,
    razorpay_signature,
    userData,
  } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
  hmac.update(order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  const isAuth = generated_signature === razorpay_signature;
  if (isAuth) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!userData.mode) {
      return res.status(400).json({ error: "Mode Error" });
    }

    const sub = await bcrypt.hash(userData.email, 12);
    const user = await User.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      college: userData.college,
      phno: userData.phno,
      year: userData.year,
      branch: userData.branch,
      collegeId: userData.collegeId,
      gender: userData.gender,
      amountPaid: amount,
      img: userData.img,
      razorpay_order_id: order_id,
      state: userData.state,
      district: userData.district,
      idUpload: userData.idUpload,
      sub,
      city: userData.city,
      referredBy: userData.referredBy,
      mode: userData.mode,
    });

    await SignUser.findOneAndDelete({ email: userData.email });

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (userData.referredBy && userData.referredBy.length === 9) {
      const ref = await User.findOneAndUpdate(
        { tzkid: userData.referredBy.toLowerCase() },
        { $push: { refreals: user.tzkid } }
      );

      if (!ref) {
        return res.status(200).json({
          token,
          user,
          success: true,
          message: "Registration Succesful\nReferral was not valid",
        });
      }
    }



  
     
     await sendemail(
     user
     )
 

    return res
      .status(200)
      .json({ success: true, token, user, message: "Registration SuccessFull" });



  } else {
    return res.status(400).json({
      message: "Payment Failed Due to Signature not matched",
      success: false,
    });
  }
};



const sendemail = async ( 
  user) => {
 
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.email",
      service: "gmail",
      auth: {
        user: "codewithsiddhu@gmail.com",
        pass: "dlal duio nspt uiul",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Craft the email content
    const mailOptions = {
      from: "noreply@gmail.com",
      to: user.email,
      subject: "Teckzite Registration Successfull",
      html: `
       <h1>Cheerio Invitation</h1>
       <h1>${user.tzkid}</h1>
       <h1>${user.email}</h1>
       <h1>${user.firstName}</h1>
       <h1>${user.lastName}</h1>
       <h1>${user.college}</h1>
       <h1>${user.phno}</h1>
       <h1>${user.year}</h1>
       <h1>${user.branch}</h1>
       <h1>${user.collegeId}</h1>
       <h1>${user.gender}</h1>
       <h1>${user.amountPaid}</h1>
       <h1>${user.state } ${user.district} ${user.city} </h1>
      <h1>${user.mode}</h1>
    

      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


export const getTopReferrals = async (req, res) => {
  try {
    const users = await User.find();
    users.sort((a, b) => b.refreals.length - a.refreals.length);
    const topUsers = users.slice(0, 10);

    const formattedUsers = topUsers.map((user) => ({
      email: user.email,
      firstName: user.firstName,
      tzkid: user.tzkid,
      referralsCount: user.refreals.length,
    }));

    return res.status(200).json({ leaderboard: formattedUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllSignUsers = async (req, res) => {
  console.log("test");
  try {
    const signusers = await SignUser.find();
    return res.status(200).json({ signusers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params; // Assuming the ID of the user to be deleted is passed in the request parameters

  try {
    const user = await User.findOneAndDelete({ tzkid: id }); // Find and delete user based on tzkid

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
