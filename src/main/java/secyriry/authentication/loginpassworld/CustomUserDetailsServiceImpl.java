package secyriry.authentication.loginpassworld;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import secyriry.repository.UserRepository;
import secyriry.service.UserService;

@Service("userDetailsService")
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {

    private UserRepositorys userRepository;
    @Autowired
    private UserService userRepositorys;


    public CustomUserDetailsServiceImpl() {

    }

    @Override
    public UserDetails loadUserByUsernameAndDomain(String username, String domain) throws UsernameNotFoundException {
        if (username == null || domain == null) {
            throw new UsernameNotFoundException("Username and domain must be provided");
        }
        //User user = userRepository.findUser(username, domain);
        secyriry.authentication.loginpassworld.User user = userRepositorys.findUserMy(username, domain);
        if (user == null) {
            throw new UsernameNotFoundException(
                    String.format("Username not found for domain, username=%s, domain=%s",
                            username, domain));
        }
        return user;
    }


}