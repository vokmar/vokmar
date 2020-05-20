package secyriry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import secyriry.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}
