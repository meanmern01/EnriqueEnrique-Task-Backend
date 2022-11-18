const jwt = require("jsonwebtoken");
const pool = require("../Config/db.config");
const validator = require("validator");
const bcrypt = require("bcrypt");

const extime = 10 * 60 * 60;
const genratetoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: extime,
  });
};

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;
  if (!validator.isEmail(req.body.email)) {
    return res
      .status(400)
      .json({ code: 400, message: "Please enter a valid Email" });
  }
  
  pool
    .query(`SELECT * FROM public."Users" WHERE username = '${username}'`)
    .then(async (result) => {
      if (result.rows.length > 0) {
        return res
          .status(409)
          .json({ code: 409, message: "Username Already Exists" });
      }
      pool
        .query(`SELECT * FROM public."Users" WHERE email = '${email}'`)
        .then(async (result) => {
          if (result.rows.length > 0) {
            return res
              .status(409)
              .json({ code: 409, message: "Email Already Exists" });
          }
          const strongPassword = new RegExp(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
          );
          if (!strongPassword.test(password.trim())) {
            return res.status(422).json({
              code: 422,
              message:
                "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !",
            });
          }
          const hashpass = await bcrypt.hash(password, 10);
          pool
            .query(
              `INSERT INTO public."Users"(username, email, password)
          VALUES ('${username}','${email}','${hashpass}')`
            )
            .then((result) => {
              return res
                .status(200)
                .json({ code: 200, message: "User create Successfully" });
            })
            .catch((error) => {
              return res
                .status(404)
                .json({ code: 404, message: error.message });
            });
        })
        .catch((error) => {
          return res.status(404).json({ code: 404, message: error.message });
        });
    })
    .catch((error) => {
      return res.status(404).json({ code: 404, message: error.message });
    });
};

exports.signIn = async (req, res) => {
  const { userInput, password } = req.body;
  pool
    .query(
      `SELECT * FROM public."Users" WHERE username = '${userInput}' OR email = '${userInput}'`
    )
    .then(async (result) => {
      if (result.rows.length == 0) {
        return res.status(400).json({
          code: 400,
          message: "Please enter a valid Email Or Username",
        });
      }
      const strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
      );
      if (!strongPassword.test(password.trim())) {
        return res.status(422).json({
          code: 422,
          message:
            "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !",
        });
      }
      let user = result.rows[0];
      const validuser = await bcrypt.compare(password, user.password);
      if (!validuser) {
        return res.status(404).json({ code: 404, message: "Wrong Password" });
      }
      const token = genratetoken(user.id);

      if (user.authtoken == null) {       
        pool
          .query(
            `UPDATE public."Users" SET authtoken = '${token}' WHERE username = '${user.username}'`
          )
          .then((result) => {
            return res
              .status(200)
              .json({ code: 200, message: "User Login Successfully", token });
          })
          .catch((error) => {
            return res.status(404).json({ code: 404, message: error.message });
          });
      } else {        
        pool
          .query(
            `UPDATE public."Users" SET authtoken = '${token}' WHERE username = '${user.username}'`
          )
          .then((result) => {
            return res
              .status(200)
              .json({ code: 200, message: "User Login Successfully", token });
          })
          .catch((error) => {
            return res.status(404).json({ code: 404, message: error.message });
          });
      }
    })
    .catch((error) => {
      return res.status(404).json({ code: 404, message: error.message });
    });
};

exports.Logout = async (req, res) => {
  await pool
    .query(
      `UPDATE public."Users" SET authtoken = null WHERE id = '${req.user.id}'`
    )
    .then((result) => {
      return res
        .status(200)
        .json({ code: 200, message: "User Logout Successfully" });
    })
    .catch((error) => {
      return res.status(404).json({ code: 404, message: error.message });
    });
};

exports.Filter = async (req, res) => {
  const { price, soldquantity } = req.body;
  if(!price && !soldquantity){ 
    return res.status(404).json({ code: 404, message: "Enter Filter Data" });
  }
  if (price && soldquantity) {
    if (price.min > price.max) {
      return res
        .status(404)
        .json({ code: 404, message: "Enter Valid Price Filter Value" });
    } else if (soldquantity.min > soldquantity.max) {
      return res
        .status(404)
        .json({ code: 404, message: "Enter Valid Soldqauntity Filter Value" });
    }
    await pool
      .query(
        `SELECT * FROM public."Products" WHERE price >= ${price.min} AND price <= ${price.max} AND soldquantity >= ${soldquantity.min} AND soldquantity <= ${soldquantity.max}`
      )
      .then((result) => {
        return res.status(200).json({ code: 200, message: result.rows });
      })
      .catch((error) => {
        return res.status(404).json({ code: 404, message: error.message });
      });
  }
  if (price && !soldquantity) {
    if (price.min > price.max) {
      return res
        .status(404)
        .json({ code: 404, message: "Enter Valid Price Filter Value" });
    }
    await pool
      .query(
        `SELECT * FROM public."Products" WHERE price >= ${price.min} AND price <= ${price.max}`
      )
      .then((result) => {
        return res.status(200).json({ code: 200, message: result.rows });
      })
      .catch((error) => {
        return res.status(404).json({ code: 404, message: error.message });
      });
  }
  if (!price && soldquantity) {
    if (soldquantity.min > soldquantity.max) {
      return res
        .status(404)
        .json({ code: 404, message: "Enter Valid Soldqauntity Filter Value" });
    }
    await pool
      .query(
        `SELECT * FROM public."Products" WHERE soldquantity > ${soldquantity.min} AND soldquantity < ${soldquantity.max}`
      )
      .then((result) => {
        return res.status(200).json({ code: 200, message: result.rows });
      })
      .catch((error) => {
        return res.status(404).json({ code: 404, message: error.message });
      });
  }
};

exports.GetProducts = async (req, res) => {
  await pool
    .query(
      `SELECT * FROM public."Products"`
    )
    .then((result) => {
      return res.status(200).json({ code: 200, message: result.rows });
    })
    .catch((error) => {
      return res.status(404).json({ code: 404, message: error.message });
    });
};
