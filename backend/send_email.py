import smtplib
from email.message import EmailMessage
from backend import config

def send_reset_email(email: str, token: str):
    msg = EmailMessage()
    msg['Subject'] = 'Password Reset Request'
    msg['From'] = config.EMAIL_SENDER
    msg['To'] = email
    msg.set_content(f"""
    Hi,

    You requested a password reset. Use the token below to reset your password:

    {token}

    If you did not request this, please ignore this email.

    Thanks,
    Your Team
    """)

    # Replace with your SMTP server details
    with smtplib.SMTP_SSL(config.SMTP_SERVER, config.SMTP_PORT) as server:
        server.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
        server.send_message(msg)