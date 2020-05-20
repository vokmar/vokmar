package secyriry.authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import secyriry.entity.User;
import secyriry.repository.UserRepository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/*
Собственный провайдер аудентификации
 */

@Component
public class CustomAuthencationProvider implements AuthenticationProvider {

    @Autowired
    UserRepository userRepository;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    AuthenticationManagers authenticationManager;
    @Autowired
    private HttpSession httpSession;

    public CustomAuthencationProvider() {
        super();
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String userName = authentication.getName(); // получаем из запроса
        String password = authentication.getCredentials().toString();
        //String capha = authenticationManager.authenticate(authentication).getPrincipal();


        //String df = httpSession.getAttribute("capha").toString();

        User myUser = userRepository.findByUsername(userName); // проверяем есть ли данный пользователь

        if (myUser == null) {
            throw new UsernameNotFoundException("Пользователя не существует");
        }
        if (!bCryptPasswordEncoder.matches(password, myUser.getPassword())) { // если ок true
            throw new BadCredentialsException("Не верный пароль");
        }


        if (myUser.getUsername().equals(userName) && bCryptPasswordEncoder.matches(password, myUser.getPassword())) {

            final UserDetails principal = new org.springframework.security.core.userdetails.User(userName, password, myUser.getAuthorities()); //введенные: имя, пароль, и полученные роли
            final Authentication auth = new UsernamePasswordAuthenticationToken(principal, password, myUser.getAuthorities());

            return auth;

        } else {
            throw new
                    BadCredentialsException("Ошибка ввода данных");

        }

    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
