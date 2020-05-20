package secyriry.authentication.loginpassworld;

import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class CustomAuthenticationFilte extends UsernamePasswordAuthenticationFilter {


    public static final String SPRING_SECURITY_FORM_CAPTCHA_KEY = "captha";

    public CustomAuthenticationFilte() {
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        if (!request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: "
                    + request.getMethod());
        }


        CustomAuthenticationToken authRequest = getAuthRequest(request);
        String cah = request.getSession().getAttribute("capha").toString();
        String cah2 = authRequest.getCaptha();
        if (cah.equals(cah2)) {
        } else {
            throw new BadCredentialsException("Не верный проверочный код");
        }
        //Делаем для сессии тайм-аут 30 мин - это вреенный код, его нужно поменять
        request.getSession(false).setMaxInactiveInterval(60 * 30);

        return this.getAuthenticationManager().authenticate(authRequest);

    }


    private CustomAuthenticationToken getAuthRequest(HttpServletRequest request) {
        String username = obtainUsername(request);
        //Если не введено имя пользователя
        if (username == null || username.equals("")) {
            throw new UsernameNotFoundException("Укажите имя пользователя!");
        }
        String password = obtainPassword(request);
        String captha = obtainCaptha(request);
        return new CustomAuthenticationToken(username, password, captha);
    }


    private String obtainCaptha(HttpServletRequest request) {
        return request.getParameter(SPRING_SECURITY_FORM_CAPTCHA_KEY);
    }


}
