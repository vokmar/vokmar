package secyriry.authentication.loginpassworld;

public interface UserRepositorys {

    User findUser(String username, String domain);
}
