userdel -r ppweb
useradd -s /sbin/nologin ppweb
(echo dbPasswordExample; echo dbPasswordExample) | passwd ppweb
