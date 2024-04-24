import express from "express";


const router = express.Router();
import {qrUserAdd,getUserByTzkid} from '../controllers/QRcodeControllers.js'



router.post('/users', qrUserAdd);
router.get('/getUser/:tzkid',getUserByTzkid);
export default router;
