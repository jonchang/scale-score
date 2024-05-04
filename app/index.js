const btn_good = document.getElementById("btn-good");
const btn_bad = document.getElementById("btn-bad");
const input_basename = document.getElementById("basename");
const input_rater = document.getElementById("rater");
const img = document.getElementById("image-display")

const post_url = "https://scale-score.jonchang.workers.dev/api/rate/"
const get_url = "https://scale-score.jonchang.workers.dev/api/next"
const img_prefix = "https://scale-score.neocities.org/"

function update_img() {
    const response = fetch(get_url).then(response => {
        response.json().then(js => {
            const basename = js[0].basename;
            const img_url = img_prefix + basename[0] + "/" + basename;
            img.src = img_url;
            input_basename.value = basename;
        })
    })
}

function buttons_off() {
    btn_good.disabled = true;
    btn_bad.disabled = true;
}

function buttons_on() {
    btn_good.disabled = false;
    btn_bad.disabled = false;
}

function evt_submit(evt) {
    evt.preventDefault();
    if (!input_rater.value) {
        alert("must say who you are");
        return;
    }

    const btn = event.currentTarget;
    if (btn.disabled) {
        return;
    }
    buttons_off();


    let rating = 0;
    if (btn.id == "btn-good") {
        rating = 1;
    }

    let to_submit = {
        rater: input_rater.value,
        rating: rating
    }

    const submit_url = post_url + input_basename.value;

    return fetch(submit_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(to_submit)
    }).then(resp => {
        if (!resp.ok) {
            resp.text().then(msg => { throw new Error(msg) });
        }
        update_img();
        buttons_on();
    });
}

document.addEventListener('DOMContentLoaded', function() { update_img(); buttons_on(); });
btn_good.addEventListener('click', evt_submit);
btn_bad.addEventListener('click', evt_submit);
