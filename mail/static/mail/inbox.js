document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  //document.querySelector('#mail_view')

  // When form submited, take values and send them to /emails
  document.querySelector('#compose-form').onsubmit = () => {
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
      div.innerHTML =  `<div><span id="sender">${email.sender}</span> <span id="subject">${email.subject}</span>
      <span id="timestamp">${email.timestamp}</span></div>`;

      //if the email is unread make background gray
      if (email.read === true) {
        div.style.background = "#d3d3d3" ;
      }
      document.querySelector('#emails-view').appendChild(div);
      div.addEventListener('click', function() {
        load_email(email.id, mailbox);
      })
    });
  })
}

function load_email(email_id, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#em_view').style.display = 'block';

  //set archived button if we are to inbox mailbox
  document.querySelector('#archived_button').style.display = 'none';
  if (mailbox === 'inbox') {
    document.querySelector('#archived_button').style.display = 'block';
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

  //Click listener for archive button
  document.querySelector('#archived_button').addEventListener('click', () => {
    archive_manager(email_id);
  })
}

function archive_manager(email_id) {
  

  //email is archived, change it and call mailbox('inbox')
  condition.innerHTML = 'Archived';

}