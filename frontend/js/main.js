// Backend server
var BACKEND_URL = "http://127.0.0.1:8000";


// ---------------------------------------------------------------
// LANGUAGE
// ---------------------------------------------------------------

function setLang(lang) {
    document.body.classList.toggle('lang-mr', lang === 'mr');

    document.getElementById('btn-en').classList.toggle(
        'active',
        lang === 'en'
    );

    document.getElementById('btn-mr').classList.toggle(
        'active',
        lang === 'mr'
    );
}


// ---------------------------------------------------------------
// SESSION SELECTION
// ---------------------------------------------------------------

function selectSession(el) {

    document.querySelectorAll('.session-pick').forEach(function (s) {
        s.classList.remove('selected');
    });

    el.classList.add('selected');

    el.querySelector('input[type=radio]').checked = true;

    updateTotal();
}


// ---------------------------------------------------------------
// UPDATE BOOKING TOTAL
// ---------------------------------------------------------------

function updateTotal() {

    var selected = document.querySelector('.session-pick.selected');

    if (!selected) {
        return;
    }

    var price = parseInt(
        selected.getAttribute('data-price'),
        10
    );

    var guests = parseInt(
        document.getElementById('f-guests').value || '1',
        10
    );

    var total = price * Math.max(guests, 1);

    document.getElementById('total-amt').textContent =
        '₹' + total;
}


// ---------------------------------------------------------------
// LOAD CONTENT FROM BACKEND
// ---------------------------------------------------------------

function loadContent() {

    fetch(BACKEND_URL + '/api/sessions')

        .then(function (r) {
            return r.json();
        })

        .then(function (data) {

            renderSessions(data.sessions || []);

            renderTeaching(data.teaching || []);

            renderGallery(data.gallery || []);

        })

        .catch(function (err) {

            console.error(
                'Could not load content from backend:',
                err
            );

        });
}


// ---------------------------------------------------------------
// RENDER SESSIONS
// ---------------------------------------------------------------

function renderSessions(sessions) {

    var list = document.getElementById('session-list');

    list.innerHTML = '';

    sessions.forEach(function (s, i) {

        var div = document.createElement('div');

        div.className =
            'session-pick' +
            (i === 0 ? ' selected' : '');

        div.setAttribute(
            'data-session-id',
            s.id
        );

        div.setAttribute(
            'data-price',
            s.priceInRupees
        );

        div.setAttribute(
            'onclick',
            'selectSession(this)'
        );

        div.innerHTML =
            '<div>' +

                '<input type="radio" name="session"' +
                (i === 0 ? ' checked' : '') +
                '>' +

                '<span class="s-name">' +

                    '<span lang-en>' +
                    s.nameEn +
                    '</span>' +

                    '<span lang-mr>' +
                    s.nameMr +
                    '</span>' +

                '</span>' +

                '<div class="s-meta">' +

                    '<span lang-en>' +
                    s.metaEn +
                    '</span>' +

                    '<span lang-mr>' +
                    s.metaMr +
                    '</span>' +

                '</div>' +

            '</div>' +

            '<div class="s-price">' +
            '₹' +
            s.priceInRupees +
            '</div>';

        list.appendChild(div);

    });

    setLang(
        document.body.classList.contains('lang-mr')
            ? 'mr'
            : 'en'
    );

    updateTotal();
}


// ---------------------------------------------------------------
// RENDER TEACHING TOPICS
// ---------------------------------------------------------------

function renderTeaching(topics) {

    var grid =
        document.getElementById('teach-grid');

    grid.innerHTML = '';

    topics.forEach(function (t) {

        var card =
            document.createElement('div');

        card.className = 'teach-card';

        card.innerHTML =

            '<div class="icon">' +
            t.icon +
            '</div>' +

            '<h3>' +

                '<span lang-en>' +
                t.titleEn +
                '</span>' +

                '<span lang-mr>' +
                t.titleMr +
                '</span>' +

            '</h3>' +

            '<p>' +

                '<span lang-en>' +
                t.descEn +
                '</span>' +

                '<span lang-mr>' +
                t.descMr +
                '</span>' +

            '</p>';

        grid.appendChild(card);

    });

    setLang(
        document.body.classList.contains('lang-mr')
            ? 'mr'
            : 'en'
    );
}


// ---------------------------------------------------------------
// RENDER GALLERY
// ---------------------------------------------------------------

function renderGallery(photos) {

    var grid =
        document.getElementById('gallery-grid');

    grid.innerHTML = '';

    photos.forEach(function (p) {

        var item =
            document.createElement('div');

        item.className = 'g-item';

        var imgUrl =
            BACKEND_URL +
            '/images/' +
            p.image;

        item.innerHTML =

            '<img src="' +
            imgUrl +
            '" alt="" ' +

            'style="' +
            'position:absolute;' +
            'inset:0;' +
            'width:100%;' +
            'height:100%;' +
            'object-fit:cover;' +
            'z-index:0;" ' +

            'onerror="' +
            "this.style.display='none'" +
            '">' +

            '<span style="' +
            'position:relative;' +
            'z-index:1;">' +

                '<span lang-en>' +
                p.captionEn +
                '</span>' +

                '<span lang-mr>' +
                p.captionMr +
                '</span>' +

            '</span>';

        item.style.position = 'relative';

        grid.appendChild(item);

    });

    setLang(
        document.body.classList.contains('lang-mr')
            ? 'mr'
            : 'en'
    );
}


// ---------------------------------------------------------------
// PAGE LOAD
// ---------------------------------------------------------------

document.addEventListener(
    'DOMContentLoaded',
    function () {

        document
            .getElementById('f-guests')
            .addEventListener(
                'input',
                updateTotal
            );

        loadContent();

    }
);


// ---------------------------------------------------------------
// PAYMENT
// ---------------------------------------------------------------

function payNow() {

    var name =
        document
            .getElementById('f-name')
            .value
            .trim();

    var phone =
        document
            .getElementById('f-phone')
            .value
            .trim();

    var email =
        document
            .getElementById('f-email')
            .value
            .trim();

    var date =
        document
            .getElementById('f-date')
            .value;

    var guests =
        document
            .getElementById('f-guests')
            .value;

    var msg =
        document.getElementById('pay-msg');


    // Validate form
    if (!name || !phone || !email || !date) {

        msg.style.color = 'var(--clay)';

        msg.innerHTML =
            '<span lang-en>' +
            'Please fill all fields before paying.' +
            '</span>' +

            '<span lang-mr>' +
            'कृपया पैसे भरण्याआधी सर्व माहिती भरा.' +
            '</span>';

        setLang(
            document.body.classList.contains('lang-mr')
                ? 'mr'
                : 'en'
        );

        return;
    }


    // Get selected session
    var selected =
        document.querySelector(
            '.session-pick.selected'
        );

    var sessionId =
        selected.getAttribute(
            'data-session-id'
        );


    msg.style.color = 'var(--soil)';

    msg.innerHTML =
        '<span lang-en>' +
        'Setting up payment…' +
        '</span>' +

        '<span lang-mr>' +
        'पेमेंट सुरू करत आहे…' +
        '</span>';

    setLang(
        document.body.classList.contains('lang-mr')
            ? 'mr'
            : 'en'
    );


    // Create Razorpay order
    fetch(
        BACKEND_URL + '/api/create-order',
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({

                sessionId: sessionId,

                guests: guests,

                name: name,

                phone: phone,

                email: email,

                visitDate: date

            })
        }
    )

    .then(function (r) {
        return r.json();
    })

    .then(function (order) {

        if (order.error) {
            throw new Error(order.error);
        }


        var options = {

            key: order.key_id,

            amount: order.amount,

            currency: order.currency,

            order_id: order.order_id,

            name: "Our Farm",

            description:
                order.session_name_en +
                " — " +
                date,

            prefill: {

                name: name,

                email: email,

                contact: phone

            },

            theme: {
                color: "#B23A22"
            },


            // Payment successful
            handler: function (response) {

                msg.innerHTML =
                    '<span lang-en>' +
                    'Confirming payment…' +
                    '</span>' +

                    '<span lang-mr>' +
                    'पेमेंट पडताळत आहे…' +
                    '</span>';

                setLang(
                    document.body.classList.contains('lang-mr')
                        ? 'mr'
                        : 'en'
                );


                // Verify payment with backend
                fetch(
                    BACKEND_URL +
                    '/api/verify-payment',
                    {

                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({

                            razorpay_order_id:
                                response.razorpay_order_id,

                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_signature:
                                response.razorpay_signature,

                            sessionId: sessionId,

                            guests: guests,

                            name: name,

                            phone: phone,

                            email: email,

                            visitDate: date

                        })

                    }
                )

                .then(function (r) {
                    return r.json();
                })

                .then(function (result) {

                    if (result.verified) {

                        msg.style.color =
                            'var(--field)';

                        msg.innerHTML =
                            '<span lang-en>' +
                            'Payment confirmed. Your session is booked!' +
                            '</span>' +

                            '<span lang-mr>' +
                            'पेमेंट निश्चित झाले. तुमचं सत्र बुक झालं आहे!' +
                            '</span>';

                    } else {

                        msg.style.color =
                            'var(--clay)';

                        msg.innerHTML =
                            '<span lang-en>' +
                            'We could not confirm this payment. Please contact us.' +
                            '</span>' +

                            '<span lang-mr>' +
                            'हे पेमेंट निश्चित करता आलं नाही. कृपया आमच्याशी संपर्क साधा.' +
                            '</span>';

                    }

                    setLang(
                        document.body.classList.contains('lang-mr')
                            ? 'mr'
                            : 'en'
                    );

                });

            },


            // Razorpay window closed
            modal: {

                ondismiss: function () {

                    msg.style.color =
                        'var(--clay)';

                    msg.innerHTML =
                        '<span lang-en>' +
                        'Payment window closed — no charge was made.' +
                        '</span>' +

                        '<span lang-mr>' +
                        'पेमेंट विंडो बंद झाली — कोणतेही पैसे कापले गेले नाहीत.' +
                        '</span>';

                    setLang(
                        document.body.classList.contains('lang-mr')
                            ? 'mr'
                            : 'en'
                    );

                }

            }

        };


        var rzp =
            new Razorpay(options);

        rzp.open();

    })

    .catch(function (err) {

        msg.style.color =
            'var(--clay)';

        msg.innerHTML =
            '<span lang-en>' +
            'Could not reach the payment server. Is the backend running?' +
            '</span>' +

            '<span lang-mr>' +
            'पेमेंट सर्व्हरशी संपर्क होऊ शकला नाही. बॅकएंड सुरू आहे का ते तपासा.' +
            '</span>';

        setLang(
            document.body.classList.contains('lang-mr')
                ? 'mr'
                : 'en'
        );

        console.error(err);

    });

}