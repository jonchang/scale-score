const btn_good = document.getElementById("btn-good");
const btn_bad = document.getElementById("btn-bad");
const input_idx = document.getElementById("idx");
const input_basename = document.getElementById("basename");
const input_rater = document.getElementById("rater");
const img = document.getElementById("image-display");
const preview = document.getElementById("preview");

const post_url = "https://scale-score.jonchang.workers.dev/api/rate/"
const get_url = "https://scale-score.jonchang.workers.dev/api/next"
const img_prefix = "https://scale-score.neocities.org/"
const searchParams = new URLSearchParams(window.location.search);

function check_mturk() {
    const rater = searchParams.get("workerId");
    if (!rater) {
        preview.innerText = 'WARNING: MTurk workerId not found! HIT data cannot be recorded.';
        buttons_off();
    }
    input_rater.value = rater;
    if (!searchParams.get("turkSubmitTo")) {
        preview.innerText = 'WARNING: MTurk turkSubmitTo not found! HIT data cannot be recorded.';
        buttons_off();
    }
    const assignment = searchParams.get("assignmentId");
    if (assignment == 'ASSIGNMENT_ID_NOT_AVAILABLE' || !assignment) {
        preview.innerText = 'WARNING: This is a preview. You must accept the HIT before submitting work!';
        buttons_off();
    }
    document.getElementById("assignmentId").value = assignment;
}

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
        input_idx.value = parseInt(input_idx.value, 10) + 1
        buttons_on();
        final_submit();
    });
}

function final_submit() {
    if (parseInt(input_idx.value, 10) >= 5) {
        const finalsubmit = document.getElementById('finalsubmit');
        const myform = document.getElementById("myform");
        myform.action = searchParams.get("turkSubmitTo") + "/mturk/externalSubmit";
        finalsubmit.hidden = false;
        finalsubmit.disabled = false;
        buttons_off();
        btn_good.hidden = true;
        btn_bad.hidden = true;
        img.hidden = true;
        myform.addEventListener("submit", function() { input_idx.value = 0; });
    }
}

document.addEventListener('DOMContentLoaded', function() { update_img(); buttons_on(); final_submit(); check_mturk(); });
btn_good.addEventListener('click', evt_submit);
btn_bad.addEventListener('click', evt_submit);
