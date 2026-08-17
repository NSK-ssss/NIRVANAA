import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TARGET_INBOX = 'nirvanaastudios@yahoo.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, botcheck } = body;

    // 1. Spam protection: Honeypot field check
    if (botcheck) {
      console.warn('[SPAM DETECTED] Honeypot field was filled. Dropping request silently.');
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // 2. Server-side validation
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';

    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      return NextResponse.json(
        { error: 'Please provide a project synopsis / message (at least 5 characters).' },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || '409ed371-5c6d-4ff8-bdb3-1d8dca297c2f';
    const subjectLine = `New Enquiry from Nirvana Studios Website - ${trimmedName}`;

    // 3. Dispatch to Web3Forms API if access key is configured
    if (accessKey && accessKey.trim().length > 0) {
      const payload = {
        access_key: accessKey.trim(),
        subject: subjectLine,
        from_name: 'Nirvana Studios Website',
        name: trimmedName,
        email: trimmedEmail,
        replyto: trimmedEmail, // Ensures clicking "Reply" in Yahoo Mail goes straight to the visitor
        phone: trimmedPhone || 'Not provided',
        message: trimmedMessage,
        to: TARGET_INBOX,
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log(`[INQUIRY DELIVERED] Successfully sent email to ${TARGET_INBOX} from ${trimmedEmail}`);
        return NextResponse.json({
          success: true,
          message: "Thanks! We'll get back to you shortly.",
        });
      } else {
        console.error('[WEB3FORMS ERROR]', result);
        return NextResponse.json(
          { error: result.message || 'Failed to deliver email. Please try again or email us directly.' },
          { status: 502 }
        );
      }
    }

    // 4. Fallback for local development when WEB3FORMS_ACCESS_KEY is not yet in .env.local
    console.log('================================================================');
    console.log(`[INQUIRY RECEIVED] Destination: ${TARGET_INBOX}`);
    console.log(`Subject: ${subjectLine}`);
    console.log(`From: ${trimmedName} <${trimmedEmail}>`);
    console.log(`Reply-To: ${trimmedEmail}`);
    console.log(`Phone: ${trimmedPhone || 'Not provided'}`);
    console.log(`Message:\n${trimmedMessage}`);
    console.log('----------------------------------------------------------------');
    console.log('NOTE: To deliver real emails to Yahoo Mail, add WEB3FORMS_ACCESS_KEY to .env.local');
    console.log('(Get a free key in 10 seconds at https://web3forms.com by entering nirvanaastudios@yahoo.com)');
    console.log('================================================================');

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll get back to you shortly.",
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try emailing us directly at nirvanaastudios@yahoo.com' },
      { status: 500 }
    );
  }
}
