const contactFormDiv = document.getElementById("contact-form")
const source = contactFormDiv.dataset.source

contactFormDiv.innerHTML = `
  <div class="bg-light-gray mw7 center pa4 br2-ns bn">
  <div class=" tc black-80 ph3 ph4-l dn" id="form-success-message">
    <h2 class="ma0 f4 f3-nsc" data-i18n="form-success">Vielen Dank, wir melden uns in Kürze bei Ihnen!</h2>
  </div>
  <form method="POST">
    <fieldset class="cf bn ma0 pa0">
      <legend class="pa0 mb3 black-80"><h2 class="ma0 f4 f3-ns" data-i18n="form-heading">Schreiben Sie uns:</h2></legend>
      <div class="cf mb2" data-i18n="form-name-and-company">
        <label class="clip" for="name">Name</label>
        <input class="f6 f5-l input-reset fl black-80 bg-white pa3 lh-solid w-50 br2 b--light-gray" placeholder="Name" type="text" name="name" value="" id="name" style="border-top: none; border-left: none; border-bottom: none;" required>
        <label class="clip" for="company">Company</label>
        <input class="f6 f5-l input-reset fl black-80 bg-white pa3 lh-solid w-50 br2 bl b--light-gray" placeholder="Firma" type="text" name="company" value="" id="company" style="border-top: none; border-right: none; border-bottom: none;" required>
      </div>
      <div class="cf" data-i18n="form-message">
        <label class="clip" for="message">Message</label>
        <textarea id="message" name="message" placeholder="Ihre Anfrage" class="f6 f5-l input-reset fl black-80 bg-white pa3 db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2 bn"></textarea>
      </div>
      <div class="cf" data-i18n="form-email-and-send">
        <label class="clip" for="email">Email Address</label>
        <input class="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2 br2-ns br--left-ns mb2 mb0-ns" placeholder="Email-Adresse" type="email" name="email" value="" id="email" required>
        <input class="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-30 hover-bg-black-50 white pointer w-100 w-25-m w-20-l br2-ns br2 br--right-ns" type="submit" value="Senden">
      </div>
    </fieldset>
    <input type="input" name="blank" value="" style="display: none" tabindex="-1" autocomplete="off">
    <input type="hidden" name="source" value="${source}" />
  </form>
  </div>
`

const form = document.querySelector('form')
const formSuccessMessage = document.getElementById('form-success-message')

form.setAttribute('action', 'https://6mgmghaj8i.execute-api.eu-central-1.amazonaws.com/production/static-site-mailer')

// Called in i18n/index.js
function fillAndAttachListener () {
  ;[...form.elements].forEach(input => {
    const value = window.localStorage.getItem(source + '-form-' + input.name)
    if (value && value !== 'undefined') {
      input.value = value
    }
  })
  ;[...form.elements].forEach(input => {
    input.addEventListener('focusout', _ => {
      if (!input.name) return
      window.localStorage.setItem(source + '-form-' + input.name, input.value)
    })
  })
}

form.onsubmit = e => {
  e.preventDefault()
  if (!!form.children.namedItem('blank').value) return

  const data = {}
  const formElements = Array.from(form)
  formElements.map(input => (data[input.name] = input.value))

  var xhr = new XMLHttpRequest()
  xhr.open(form.method, form.action, true)
  xhr.setRequestHeader('Accept', 'application/json charset=utf-8')
  xhr.setRequestHeader('Content-Type', 'application/json charset=UTF-8')

  xhr.send(JSON.stringify(data))

  xhr.onloadend = response => {
    if (response.target.status === 200) {
      form.style.display = 'none'
      formSuccessMessage.style.display = 'block'
      window.localStorage.clear()
      form.reset()
      return
    }
    window.open('mailto:hallo@thingylabs.io?subject=' +
      encodeURIComponent('Kontaktanfrage') + '&body=' +
      encodeURIComponent(`${data.message}\n\nName: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}`)
    , '_blank')
  }
}
