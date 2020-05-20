package ru.boq.vokmar.config.session;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import javax.servlet.http.HttpSessionEvent;

/*
В данном событии контролируется процесс создания и удаления сесии
Данный класс подключен в классе конфигурации сприг
*/
public class SessionEventListener extends HttpSessionEventPublisher {

    @Override
    public void sessionCreated(HttpSessionEvent event) {
        super.sessionCreated(event);
        // Сессия для формы регистраци
        // event.getSession().setMaxInactiveInterval(30*1);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        super.sessionDestroyed(event);


    }
}
