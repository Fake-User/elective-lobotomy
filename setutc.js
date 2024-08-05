async function setUTC(utc){
    const options = {
        method: "PUT",
        headers: {
            "utckey": process.env.UTC_KEY,
            "utctime": "YYYY-YY-YY YY:YY:YY"
        }
    };

    await fetch("https://destruct.rcdis.co/set-utc", options)
    .then(res => res.text())
    .then(res => {console.log(res)})
};
setUTC();
