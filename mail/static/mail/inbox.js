document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  //document.querySelector('#mail_view')

  // When form submited, take values and send them to /emails
  document.querySelector('#compose-form').onsubmit = function() {
    let recipient_list = document.querySelector('#compose-recipients').value;
    let sb = document.querySelector('#compose-subject').value;
    let bd = document.querySelector('#compose-body').value;

    // data to be sent to the POST request
    let _data = {
      recipients: recipient_list,
      subject: sb,
      body: bd
    }

    fetch('/emails', {
      method: "POST",
      body: JSON.stringify(_data),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(json => console.log(json));

    load_mailbox('sent');

    // not submit the form
    return false;
  }

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#em_view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#em_view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  // load mailbox
  fetch(`emails/${mailbox}`).then(response => response.json()).then(emails => {
    console.log(emails);
    emails.forEach(email => {
      let div = document.createElement('div');
      div.className = 'mail_div';
      div.innerHTML = `<div><span id="sender">${email.sender}</span> <span id="subject">${email.subject}</span>
      <span id="timestamp">${email.timestamp}</span></div>`;

      //if the email is unread make background gray
      if (email.read === true) {
        div.style.background = "#d3d3d3" ;
      }
      document.querySelector('#emails-view').append(div);
      div.onclick = function() {
        load_email(email.id, mailbox);
      }
    });
  })
}

function load_email(email_id, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#em_view').style.display = 'block';

  //set archive and unarchive button to inbox and archive accordingly
  if (mailbox === 'inbox') {
    document.querySelector('#archive_button').style.display = 'block';
    document.querySelector('#unarchive_button').style.display = 'none';
    document.querySelector('#archive_button').onclick = function() {
      archive_mail(email_id);
    }
  }

  if (mailbox === 'archive') {
    document.querySelector('#unarchive_button').style.display = 'block';
    document.querySelector('#archive_button').style.display = 'none';
    document.querySelector('#unarchive_button').onclick = function() {
      unarchive_mail(email_id);
    }
  }

  //fetch email details
  fetch(`emails/${email_id}`).then(response => response.json()).then(data => {
    console.log(data);
    document.querySelector('#email_subject').innerHTML = data.subject;
    document.querySelector('#email_sender').innerHTML = data.sender;
    document.querySelector('#email_recivers').innerHTML = data.recipients;
    document.querySelector('#email_body').innerHTML = data.body;
    document.querySelector('#email_timestamp').innerHTML = data.timestamp;
  });

  //mark email as read
  fetch(`emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function archive_mail(email_id) {
  fetch(`emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  }).then(function(response) {
    console.log(response);
    load_mailbox('inbox');
  })
}

function unarchive_mail(email_id) {
  fetch(`emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  }).then(function(response) {
    console.log(response);
    load_mailbox('inbox');
  })
}
