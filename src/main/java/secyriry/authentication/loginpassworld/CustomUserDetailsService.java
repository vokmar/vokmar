package secyriry.authentication.loginpassworld;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface CustomUserDetailsService {
    UserDetails loadUserByUsernameAndDomain(String username, String captha) throws UsernameNotFoundException;

}
