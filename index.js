const fetch = require('node-fetch');
const S = require('string');
const terbilang = require('@develoka/angka-terbilang-js');
const fs = require('fs');

async function getData() {
    const a = await fetch('https://randomuser.me/api/?nat=us', {
        method : "GET"
    });
    const b = await a.json();

    return Promise.resolve(b.results[0]);
}

async function getInbox(email) {
    const d = email.split("@");
    const username = d[0];
    const domain = d[1];

    try {
        const gos = await fetch('https://generator.email/', {
            method : "GET",
            headers : {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'en-US,en;q=0.9',
                'cookie': 'surl='+domain+'/'+username
            }
        });
        const response = await gos.text();
        return Promise.resolve(response);
    } catch(err) {
        return Promise.reject(err)
    }
}

function getAngka(terbilang) {
    if(terbilang === "satu") {
        return "1";
    } else if(terbilang === "dua") {
        return "2";
    } else if(terbilang === "tiga") {
        return "3";
    } else if(terbilang === "empat") {
        return "4";
    } else if(terbilang === "lima") {
        return "5";
    } else if(terbilang === "enam") {
        return "6";
    } else if(terbilang === "tujuh") {
        return "7";
    } else if(terbilang === "delapan") {
        return "8";
    } else if(terbilang === "sembilan") {
        return "9";
    } else if(terbilang === "sepuluh") {
        return "10";
    }
}


(async function() {
    const jumlah = 100;
    for(let x = 0; x < jumlah; x++) {
        const data = await getData();
        const username = (data.name.first + "" + data.name.last).toLowerCase().substr(0, 11);
        const domain = "ISI DOMAIN DARI GENERATOR.EMAIL";
        const email = username + "@" + domain;
        const password = "ISI PASSWORD";

        console.log(`[+] Email : ${email}`);
        console.log(`[+] Username : ${username}`);

        const a = await fetch('https://gnjoy.id/member/register?v=16', {
            method : "GET",
            headers : {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Language' : 'en-US,en;q=0.9',
                'Referer': 'https://lostsaga.gnjoy.id/member',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36 OPR/74.0.3911.218'
            }
        });
        const headers_a = a.headers.raw();
        const response_a = await a.text();
        
        const getCaptcha = S(response_a).between('<span><b style="color:#000; font-size:12px;">', '</b>').s.split(' ');
        const captchaAngka1 = parseInt(getAngka(getCaptcha[0]));
        const operator = getCaptcha[1];
        const captchaAngka2 = parseInt(getAngka(getCaptcha[2]));
        const hasilCaptcha = eval(captchaAngka1 + operator + captchaAngka2);
        const hasilCaptchas = terbilang(hasilCaptcha);
        console.log(`[+] Captcha : ${captchaAngka1} ${operator} ${captchaAngka2} = ${hasilCaptcha} [${hasilCaptchas}]`);

        let cookies = "";
        for(let ii = 0; ii<headers_a['set-cookie'].length; ii++) {
            let cook = headers_a['set-cookie'][ii].split("; ")[0];
            cookies += `${cook}; `;
        }

        const token = S(response_a).between('<input type="hidden" name="_token" value="', '">').s;

        const params = new URLSearchParams();

        params.append('_token', token);
        params.append('v', '16');
        params.append('uname', username);
        params.append('password', password);
        params.append('passwordcon', password);
        params.append('jk', 1);
        params.append('email', email);
        params.append('emailkonfirmasi', email);
        params.append('security', hasilCaptchas);
        params.append('eula', 'on');

        const b = await fetch('https://gnjoy.id/member/register_user', {
            method : "POST",
            headers : {
                'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Language' : 'en-US,en;q=0.9',
                'Cookie' : cookies,
                'Referer': 'https://gnjoy.id/member/register?v=16',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36 OPR/74.0.3911.218'
            },
            body : params
        });
        const response_b = await b.text();
        if(response_b.indexOf('Selamat kamu telah berhasil melakukan Daftar Baru ID') > -1) {
            console.log(`[+] Register Sukses`);
            let isGet = false;
            let otp = "";
            do {
                const doGets = await getInbox(email);
                if(doGets.indexOf('Email Notifikasi Register ID Gravity Game Link') > -1) {
                    const gtets = S(doGets).between('Kode Konfirmasi = ', '<br />').s;
                    otp = gtets;
                    isGet = true;
                }
            } while(!isGet);
            if(otp) {
                const c = await fetch('https://gnjoy.id/member/verifikasi?code=' + otp, {
                    method : "GET",
                    headers : {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Accept-Language' : 'en-US,en;q=0.9',
                        'Referer': 'https://lostsaga.gnjoy.id/member',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36 OPR/74.0.3911.218'
                    }
                });
                const headers_c = c.headers.raw();
                const response_c = await c.text();
                
                cookies = "";
                for(let ii = 0; ii<headers_c['set-cookie'].length; ii++) {
                    let cook = headers_c['set-cookie'][ii].split("; ")[0];
                    cookies += `${cook}; `;
                }
            
            
                const getTokenC = S(response_c).between('<input type="hidden" name="_token" value="', '">').s;

                const params1 = new URLSearchParams();

                params1.append('_token', getTokenC);
                params1.append('code', otp);

                await fetch('https://gnjoy.id/member/verifikasi_user', {
                    method : "POST",
                    headers : {
                        'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Accept-Language' : 'en-US,en;q=0.9',
                        'Cookie' : cookies,
                        'Referer': 'https://gnjoy.id/member/verifikasi?code=' + otp,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36 OPR/74.0.3911.218'
                    },
                    body : params1
                });
                
                console.log(`[+] Maybe this account verified`);
                await fs.appendFileSync('account.txt', `Email : ${email}\nUsername : ${username}\nPassword : ${password}\n-\n`);
                console.log(`[+] Saved`);
                console.log(``);
            } else {
                console.log(`[+] Gagal mendapatkan otp.`);
            }
        } else {
            console.log(`[+] Register Gagal`);
        }
    }
})();