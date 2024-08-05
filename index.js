const headers = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    }
}

async function getCreds(){
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Email": `${process.env.X_AUTH_EMAIL}`,
            "X-Auth-Key": `${process.env.X_AUTH_KEY}`
        },
        body: `{
            "bucket": "destruct-data",
            "parentAccessKeyId": "${process.env.AWS_ACCESS_KEY_ID}",
            "permission": "object-read-only",
            "ttlSeconds": 3600
        }`
    };

    let creds = {};

    await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/r2/temp-access-credentials`, options)
    .then(res => res.json())
    .then(res => {
        creds = {
            access_key_id: res.result.accessKeyId,
            secret_access_key: res.result.secretAccessKey,
            session_token: res.result.sessionToken
        }
    })

    return creds;
};

/*
async function initUTC(){
    await Bun.write("./store/utc.txt", "XXXX-XX-XX XX:XX:XX");
}
initUTC();
*/


let dbUtc = "";
async function getUTC(){
    const file = Bun.file("./store/utc.txt");
    dbUtc = await file.text();
}
getUTC();

async function setUTC(utcKey, utcTime){
    if(utcKey === process.env.UTC_KEY){
        await Bun.write("./store/utc.txt", utcTime);
        dbUtc = utcTime;
        console.log(utcTime);
        return `updated db-utc to ${utcTime}`;
    }
    else{
        return "done fucked up"
    };

};

Bun.serve({
    port: 3000,
    async fetch(req){
        //console.log(req);
        const path = new URL(req.url).pathname;

        switch(true){

            case path === "/creds":
                let creds = await getCreds();
                return Response.json(creds, headers);

            case path === "/set-utc":
                let head = JSON.parse(JSON.stringify(req.headers))
                let res = await setUTC(head.utckey, head.utctime);
                return Response(res, headers);

            case path === "/utc":
                return Response(dbUtc, headers);

            default:
                return Response("nah mate", headers);
        };
    },
});
