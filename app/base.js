const btn_good = document.getElementById("btn-good");
const btn_bad = document.getElementById("btn-bad");
const input_basename = document.getElementById("basename");
const input_rater = document.getElementById("rater");
const img = document.getElementById("image-display");

const post_url = "https://scale-score.jonchang.workers.dev/api/rate/"
const get_url = "https://scale-score.jonchang.workers.dev/api/next"
const review_url = "https://scale-score.jonchang.workers.dev/api/review"
const img_prefix = "https://scale-score.neocities.org/"
const searchParams = new URLSearchParams(window.location.search);

function check_mturk() {
    const preview = document.getElementById("preview");
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

function basename2url(basename) {
    let shard = basename[0];
    if (shard == '-') {
        shard = basename[1];
    }
    return img_prefix + shard + "/" + basename;
}

function update_img() {
    const response = fetch(get_url).then(response => {
        response.json().then(js => {
            const basename = js[0].basename;
            img.src = basename2url(basename)
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
        final_submit();
    });
}

function final_submit() {
    const input_idx = document.getElementById("idx");
    input_idx.value = parseInt(input_idx.value, 10) + 1

    if (parseInt(input_idx.value, 10) > 5) {
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

function create_review_item(bn) {
    const container = document.createElement("figure");
    container.className = "item";
    const img = document.createElement("img");
    img.src = basename2url(bn);
    img.setAttribute("loading", "lazy");
    const caption = document.createElement("figcaption");
    caption.innerText = bn;
    container.appendChild(img);
    container.appendChild(caption);
    return container;
}

function create_group(user) {
    const container = document.createElement("div");
    const header = document.createElement("h2");
    header.innerText = user;

    const details1 = document.createElement("details");
    const summary1 = document.createElement("summary");
    const wrap1 = document.createElement("div");
    wrap1.className = "wrap";
    summary1.innerText = "Rated Good";
    details1.appendChild(summary1);
    details1.appendChild(wrap1);

    const details2 = document.createElement("details");
    const summary2 = document.createElement("summary");
    const wrap2 = document.createElement("div");
    wrap2.className = "wrap";
    summary2.innerText = "Rated Bad";
    details2.appendChild(summary2);
    details2.appendChild(wrap2);

    container.appendChild(header);
    container.appendChild(details1);
    container.appendChild(details2);
    return [container, wrap1, wrap2];
}

function populate_review() {
    const content = document.getElementById("content");

    fetch(review_url, {
        method: 'GET',
        headers: { "Accept": "application/json" }
    }).then(resp => {
        if (!resp.ok) {
            resp.text().then(msg => { throw new Error(msg) });
        }
        return resp.json();
    }).then(json => {
        for (const [rater, reviews] of Object.entries(json)) {
            const [container, good, bad] = create_group(rater + " (" + reviews.length + ")");
            let good_count = 0;
            let bad_count = 0;
            for (const row of reviews) {
                const item = create_review_item(row.basename);
                if (row.rating === 1) {
                    good.appendChild(item);
                    good_count += 1;
                } else {
                    bad.appendChild(item);
                    bad_count += 1;
                }
            }
            good.parentNode.getElementsByTagName('summary')[0].innerText = 'Rated Good (' + good_count + ')';
            bad.parentNode.getElementsByTagName('summary')[0].innerText = 'Rated Bad (' + bad_count + ')';
            content.appendChild(container);
        }
    });
}
