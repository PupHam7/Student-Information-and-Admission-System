package com.system.sias.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@AllArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine; // Injected by Spring Boot

    public void sendCredentialsEmail(String toEmail, String firstName, String studentNumber, String password) throws MessagingException {
        // 1. Prepare the Thymeleaf context with variables
        Context context = new Context();
        context.setVariable("firstName", firstName);
        context.setVariable("studentNumber", studentNumber);
        context.setVariable("password", password);

        // 2. Process the HTML template
        String htmlContent = templateEngine.process("admission-email", context);

        // 3. Create a MimeMessage for HTML content
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

        helper.setFrom("your-email@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject("Welcome to ParSU - Your Admission is Approved!");
        helper.setText(htmlContent, true); // The 'true' flag indicates this is HTML

        // 4. Send the email
        mailSender.send(mimeMessage);
    }

    public void sendRejectionEmail(String toEmail, String firstName) throws MessagingException {
        Context context = new Context();
        context.setVariable("firstName", firstName);

        // This looks for rejection-email.html in src/main/resources/templates
        String htmlContent = templateEngine.process("rejection-email", context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

        helper.setFrom("your-email@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject("Admission Application Update - ParSU");
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }
}