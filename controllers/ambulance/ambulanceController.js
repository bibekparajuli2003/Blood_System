const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");
exports.renderCreateAmbulanceForm = async (req, res) => {
  res.render("ambulance/createForm");
};
exports.createAmbulance = async (req, res, next) => {
  const userId = req.user.id;
  const { hospitalName, address, phone } = req.body;
  if (!hospitalName || !address || !phone) {
    req.flash("error", "Please fill all the fields");
    return res.redirect(req.headers.referer || "/");
  }
  await sequelize.query(
    " CREATE TABLE ambulance IF NOT EXISTS(id NOT NULL INT PRIMARY KEY AUTO_INCREMENT,userId INT,hospitalName VARCHAR(255),address VARCHAR(255),phone INT,createdAt DATETIME DEFAULT CURRENT_TIMESTAMP) ",
    {
      type: QueryTypes.CREATE,
    }
  );
  await sequelize.query(
    " INSERT INTO ambulance (userId,hospitalName,address,phone) VALUES(?,?,?,?) ",
    {
      type: QueryTypes.INSERT,
      replacements: [userId, hospitalName, address, phone],
    }
  );
  req.flash("success", "Ambulance created successfully");
  res.redirect("/ambulance");
};
exports.renderAmbulanceList = async (req, res, next) => {
  const ambulance = await sequelize.query(" SELECT * FROM ambulances  ", {
    type: QueryTypes.SELECT,
  });
  res.render("ambulance/ambulance", { ambulance });
};
exports.renderAmbulanceDetail = async (req, res, next) => {
  const ambulanceId = req.params.id;
  const ambulance = await sequelize.query(
    " SELECT * FROM ambulance WHERE id = ? ",
    {
      type: QueryTypes.SELECT,
      replacements: [ambulanceId],
    }
  );
  res.render("ambulance/detail", { ambulance: ambulance[0] });
};

exports.deleteAmbulance = async (req, res, next) => {
  await sequelize.query("DELETE FROM ambulance WHERE id = ?", {
    type: QueryTypes.DELETE,
    replacements: [req.params.id],
  });
  req.flash("success", "Ambulance deleted successfully");
  res.redirect("/ambulance");
};


exports.addAmbulance = async (req,res)=>{
  const hospitalId = req.coookies.hospitalId
  const {name,phone,province,district,localLevel} = req.body
  if(!hospitalId){
    return res.send("Login as hospital")
  }
  await sequelize.query(
    `INSERT INTO ambulances (hospitalId,name,phone,province,district,localLevel) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    {
      type: QueryTypes.INSERT,
      replacements: [
        hospitalId,
        name,
     
        phone,
        province,
        district,
        localLevel
      ],
    }
  );
  res.redirect("/ambulance")
}

exports.getAmbulances = async (req, res, next) => {
  const province = req.query.province;
  const district = req.query.district;
  const localLevel = req.query.localLevel;

  let ambulances;
  if (!province && !district && !localLevel) {
    // if no query parameters are provided, retrieve all users
    try {
      // ambulances = await sequelize.query(`SELECT * FROM ambulances  `, {
      //   type: QueryTypes.SELECT,
      // });
      ambulances = await sequelize.query("SELECT * FROM ambulances", {
        type: QueryTypes.SELECT,
      });

    } catch (error) {
      ambulances = [];
    }
  } else if (!province && !district) {
    // if only the localLevel parameter is provided, filter by localLevel

    ambulances = await sequelize.query(
      `SELECT * FROM ambulances WHERE localLevel='${localLevel}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

  } else if (!province && !localLevel) {
    // if only the district parameter is provided, filter by district

    ambulances = await sequelize.query(
      `SELECT * FROM ambulances WHERE district='${district}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

  } else if (!district && !localLevel) {
    // if only the province parameter is provided, filter by province

    ambulances = await sequelize.query(
      `SELECT * FROM ambulances WHERE province='${province}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

  } else if (!province) {
    // if district and localLevel parameters are provided, filter by both

    ambulances = await sequelize.query(
      `SELECT * FROM ambulances WHERE localLevel='${localLevel}' AND district='${district}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
  
  } else if (!district) {
    // if province and localLevel parameters are provided, filter by both

    ambulances = await sequelize.query(
      `SELECT * FROM ambulances WHERE localLevel='${localLevel}' AND province='${province}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

  } else if (!localLevel) {
    // if province and district parameters are provided, filter by both

    ambulances = await sequelize.query(
      `SELECT * FROM ambulances WHERE province='${province}' AND district='${district}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

  } else {
    // if all parameters are provided, filter by all

    ambulances = await sequelize.query(
      `SELECT * FROM ambulances WHERE localLevel='${localLevel}' AND district='${district}' AND province='${province}'  `,
      {
        type: QueryTypes.SELECT,
      }
    );

  }
  try {
    var provinces = await sequelize.query("SELECT * FROM provinces", {
      type: QueryTypes.SELECT,
    });
  } catch (error) {
    provinces = [];
  }
  if (!ambulances)
    return res.render("error/pathError", {
      message: "No ambulances found",
      code: 400,
    });

  res.render("ambulance/ambulance", { ambulances, provinces });
};