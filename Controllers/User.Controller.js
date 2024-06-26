const userModel = require("../Models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config
let secret = process.env.SECRET
const nodemailer = require("nodemailer");

const cloudinary = require("cloudinary")

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

const welcomeUser = (req, res) => {
    res.send("Welcome to the user page")
}


const about = (req, res) => {
    res.send("Welcome to the about page")
}

const register = (req, res) => {
    res.send("Welcome to the register page")
}

const login = (req, res) => {
    res.send("Welcome to the login page")
}

const registerUser = async (req, res) => {
    let saltRound = 10 
    const {firstName, lastName, email, password} = req.body
    const plaintextPassword = password;
    // console.log(req.body);
    const hashedPassword = bcrypt.hashSync(plaintextPassword, saltRound);
    let user = new userModel ({firstName, lastName, email, password:hashedPassword})
    user.save()
    .then((response)=>{
            console.log(response);
            console.log("user saved successfully");
            res.status(201).json({Message: 'sucessfull registered'})
            sendMail(email)
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({Message: 'Erroor occurred'})

    })
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Request body:', req.body);

    let user; 
    try {
        user = await userModel.findOne({ email: email });
        console.log('User:', user);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ Message: 'Internal Server Error' });
    }

    if (!user) {
        console.log('User not found');
        return res.status(200).json({ Message: 'User not found, please sign up' });
    }

    // const userInputPassword = "userInputPassword123";
    const correctPassword = bcrypt.compareSync(password, user.password);
    console.log('Correct password:', correctPassword);

    if (!correctPassword) {
        console.log('Wrong password');
        return res.status(400).json({ Message: 'Wrong login details' });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: 10 });
    console.log('Token:', token);

    res.status(200).json({
        Message: 'Login successful',
        token: token,
        user: user
    });
    console.log("Login successful");
};

const dashboard = async (req, res) => {
    let token = req.headers.authorization.split(" ")[1]
    console.log(token);
    jwt.verify(token, secret, (err, result) => {
        if (err) {
            console.log(err);
            res.send({status: false, message: "Invalid token", result})
        }else{
            console.log(result);
            res.send({status: true, message: "Welcome", result})
        }
    })
}

const uploadProfile = async (req, res) => {
    let file =req.body.myFile;

    cloudinary.uploader.upload(file, (result, error) => {
        if(error)
         {
            console.log(error);
        }else{
            console.log(result);
            res.send({status: true, message: "suucessfully uploaded", result});
        }
    })
}

 let htmlText = `<body style="background-color:grey"> 
	<table align="center" border="0" cellpadding="0" cellspacing="0"
		width="550" bgcolor="white" style="border:2px solid black"> 
		<tbody> 
			<tr> 
				<td align="center"> 
					<table align="center" border="0" cellpadding="0"
						cellspacing="0" class="col-550" width="550"> 
						<tbody> 
							<tr> 
								<td align="center" style="background-color: #4cb96b; 
										height: 50px;"> 

									<a href="#" style="text-decoration: none;"> 
										<p style="color:white; 
												font-weight:bold;"> 
											GeeksforGeeks 
										</p> 
									</a> 
								</td> 
							</tr> 
						</tbody> 
					</table> 
				</td> 
			</tr> 
			<tr style="height: 300px;"> 
				<td align="center" style="border: none; 
						border-bottom: 2px solid #4cb96b; 
						padding-right: 20px;padding-left:20px"> 

					<p style="font-weight: bolder;font-size: 42px; 
							letter-spacing: 0.025em; 
							color:black;"> 
						Hello Geeks! 
						<br> Check out our latest Blogs 
					</p> 
				</td> 
			</tr> 

			<tr style="display: inline-block;"> 
				<td style="height: 150px; 
						padding: 20px; 
						border: none; 
						border-bottom: 2px solid #361B0E; 
						background-color: white;"> 
					
					<h2 style="text-align: left; 
							align-items: center;"> 
						Design Patterns : A Must Skill to 
					have for Software Developers in 2019 
				</h2> 
					<p class="data"
					style="text-align: justify-all; 
							align-items: center; 
							font-size: 15px; 
							padding-bottom: 12px;"> 
						Design Patterns….??? I think you have heard this name 
					before in programming… Yes, you might have heard 
					this name before in programming if you are… 
					</p> 
					<p> 
						<a href= 
"https://www.geeksforgeeks.org/design-patterns-a-must-skill-to-have-for-software-developers-in-2019/"
						style="text-decoration: none; 
								color:black; 
								border: 2px solid #4cb96b; 
								padding: 10px 30px; 
								font-weight: bold;"> 
						Read More 
					</a> 
					</p> 
				</td> 
			</tr> 
			<tr style="border: none; 
			background-color: #4cb96b; 
			height: 40px; 
			color:white; 
			padding-bottom: 20px; 
			text-align: center;"> 
				
<td height="40px" align="center"> 
	<p style="color:white; 
	line-height: 1.5em;"> 
	GeeksforGeeks 
	</p> 
	<a href="#"
	style="border:none; 
		text-decoration: none; 
		padding: 5px;"> 
			
	<img height="30"
	src= 
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-twitter_20190610074030.png"
	width="30" /> 
	</a> 
	
	<a href="#"
	style="border:none; 
	text-decoration: none; 
	padding: 5px;"> 
	
	<img height="30"
	src= 
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-linkedin_20190610074015.png"
width="30" /> 
	</a> 
	
	<a href="#"
	style="border:none; 
	text-decoration: none; 
	padding: 5px;"> 
	
	<img height="20"
	src= 
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/facebook-letter-logo_20190610100050.png"
		width="24"
		style="position: relative; 
			padding-bottom: 5px;" /> 
	</a> 
</td> 
</tr> 
<tr> 
<td style="font-family:'Open Sans', Arial, sans-serif; 
		font-size:11px; line-height:18px; 
		color:#999999;" 
	valign="top"
	align="center"> 
<a href="#"
target="_blank"
style="color:#999999; 
		text-decoration:underline;">PRIVACY STATEMENT</a> 
		| <a href="#" target="_blank"
		style="color:#999999; text-decoration:underline;">TERMS OF SERVICE</a> 
		| <a href="#"
		target="_blank"
		style="color:#999999; text-decoration:underline;">RETURNS</a><br> 
				© 2012 GeeksforGeeks. All Rights Reserved.<br> 
				If you do not wish to receive any further 
				emails from us, please 
				<a href="#"
				target="_blank"
				style="text-decoration:none; 
						color:#999999;">unsubscribe</a> 
			</td> 
			</tr> 
			</tbody></table></td> 
		</tr> 
		<tr> 
		<td class="em_hide"
		style="line-height:1px; 
				min-width:700px; 
				background-color:#ffffff;"> 
			<img alt=""
			src="images/spacer.gif"
			style="max-height:1px; 
			min-height:1px; 
			display:block; 
			width:700px; 
			min-width:700px;" 
			width="700"
			border="0"
			height="1"> 
			</td> 
		</tr> 
		</tbody> 
	</table> 
</body>`




const sendMail = (email)=>{
   const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
   })

   let mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "Hello ✔", 
    text: "sending an email to check",
    html: htmlText,
}

transporter.sendMail(mailOption, (err, result)=>{
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
})

}


module.exports = {welcomeUser, about, login, register, registerUser, loginUser, dashboard, uploadProfile, sendMail}
