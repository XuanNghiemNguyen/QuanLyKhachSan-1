const express = require("express")
const router = express.Router()
const User = require("../../models/user.model")
const User_Verify = require("../../models/verify.model")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs")

const getRandomCode = () => {
  let ss = Math.floor(Math.random() * Math.floor(100000))
    .toString()
    .split("")
  while (ss.length < 6) {
    ss.unshift("0")
  }
  return ss.join("")
}

router.get("/", async (req, res) => {
  try {
    return res.render("pages/forgot-password/index", {
      layout: false,
      clientName: `${process.env.CLIENT_NAME}`,
      message: "",
    })
  } catch (error) {
    console.log(error)
  }
})
router.get("/change-password", async (req, res) => {
  try {
    const { email, error } = req.query
    if (!email) {
      console.log("Bạn chưa nhận mã OTP")
      return res.redirect("/forgot-password")
    }
    return res.render("pages/forgot-password/change", {
      layout: false,
      clientName: `${process.env.CLIENT_NAME}`,
      email,
      error_otp: !error ? "none" : "block",
      check_otp: !error ? "block" : "none",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.toString(),
    })
  }
})
router.post("/getOTP", async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return
    }
    const user = await User.findOne({ email })
    if (user) {
      const OTP_CODE = getRandomCode()
      const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
      const time = now.split(", ")[1]
      const date = now.split(", ")[0].split("/")
      const dateString = `${time} - ngày ${date[1]}, tháng ${date[0]}, năm ${date[2]}`
      const transporter = nodemailer.createTransport({
        // config mail server
        service: "Gmail",
        auth: {
          user: process.env.USER_NAME,
          pass: process.env.PASSWORD,
        },
      })
      const mainOptions = {
        // thiết lập đối tượng, nội dung gửi mail
        from: "Hệ thống ứng dụng quản lý khách sạn",
        to: email,
        subject: "[HOTEL MANAGEMENT SOFTWARE] Yêu cầu xác thực OTP",
        text: "You recieved message from " + req.body.email,
        html: `
            <h3>Xin chào <b> ${user.name}</b>, </h3>
            <p>Chúng tôi vừa nhận được yêu cung cấp mã OTP từ bạn vào lúc ${dateString}. Nếu bạn không thực hiện, vui lòng bỏ qua E-mail này!</p>
            <p>Mã OTP của bạn là: <h3>${OTP_CODE}</h3></p>
            <p>Bạn không nên chia sẻ mã này cho bất kì ai, kể cả nhân viên của hệ thống chúng tôi.</p>
            <h5>Trân trọng cảm ơn!<h5>
            <h5>Hệ thống ứng dụng quản lý khách sạn<h5>
          `,
      }
      transporter.sendMail(mainOptions, async (err, info) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.toString(),
          })
        } else {
          const jwtCode = jwt.sign({ email }, OTP_CODE.toString(), {
            expiresIn: 600,
          })
          let user_Verify = await User_Verify.findOne({ email })
          if (user_Verify) {
            user_Verify.jwtCode = jwtCode
            user_Verify.isUsed = false
            user_Verify.updatedAt = Date.now()
          } else {
            user_Verify = new User_Verify()
            user_Verify.email = email
            user_Verify.jwtCode = jwtCode
            user_Verify.updatedAt = Date.now()
          }
          await user_Verify.save()
        }
      })
      return res.redirect(`/forgot-password/change-password?email=${email}`)
    } else {
      console.log("Tài khoản không tồn tại!")
      return
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.toString(),
    })
  }
})


router.post("/change-password", async (req, res) => {
  try {
    const { email } = req.query
    const { code, new_password } = req.body
    if (!new_password || !code) {
      return
    }
    if (!email) {
      return res.redirect(`/forgot-password/change-password?email=${email}`)
    }
    let user = await User.findOne({ email })
    if (!user) {
      return res.redirect(`/forgot-password/change-password?email=${email}&error=true`)
    }

    let user_Verify = await User_Verify.findOne({ email, isUsed: false })
    if (!user_Verify || !user_Verify.jwtCode) {
      return res.redirect(`/forgot-password/change-password?email=${email}&error=true`)
    }
    jwt.verify(user_Verify.jwtCode, code.toString(), async (err, payload) => {
      if (err) {
        return res.redirect(`/forgot-password/change-password?email=${email}&error=true`)
      }
      if (!payload || !payload.email || payload.email !== email) {
        return res.redirect(`/forgot-password/change-password?email=${email}&error=true`)
      }
      user_Verify.isUsed = true
      await user_Verify.save()
    })
    user.password = await bcrypt.hash(new_password, 10)
    await user.save()
    user_Verify.isUsed = true
    await user_Verify.save()
    return res.redirect("/login")
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.toString(),
    })
  }
})
module.exports = router
