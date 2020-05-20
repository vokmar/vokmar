package secyriry.authentication.loginpassworld;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collection;


@Repository("userRepositorys")
public class CustomUserRepository implements UserRepositorys {


    @Override
    public User findUser(String username, String domain) {
        if (username == null || domain == null) {
            return null;
        } else {
            Collection<? extends GrantedAuthority> authorities = new ArrayList<>();
            User user = new User(username, domain,
                    "$2a$10$U3GhSMpsMSOE8Kqsbn58/edxDBKlVuYMh7qk/7ErApYFjJzi2VG5K", true,
                    true, true, true, authorities);
            return user;
        }
    }
}
