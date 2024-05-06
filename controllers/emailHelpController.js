import sendEmail from "../helpers/sendEmail.js";


const emailHelp = async (req, res) => {



   const letterHelp = {
        to: "topanasenko85@gmail.com",
        subject: "HELP",
        html: `<div><h1>Помогите спасите </strong></h1>
                <p>прошу помочь мне</strong></p>
             <p>Как так помогите</strong></p><div/>`,
    };
    await sendEmail(letterHelp);

    res.json({
        message: "Reply email has been sent",
    });
};

export default emailHelp;
