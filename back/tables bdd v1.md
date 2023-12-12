
> **USER**
> 
> (***id_user***, user_name, user_surname, user_pseudonym, user_password, user_OAuth42_link, user_google_authenticator_link, user_last_connection, user_path_avatar, user_status, user_score, user_helo)

> **CHANNEL**
> 
> (***id_channel***, chabbel_status, channel_password, channel_date_creation)

> **CHANNEL_MEMBER_STATUS**
> 
> (***id_channel_member_status***, channel_member_status_name, channel_member_status_description)

> **DIVISION**
> 
> (***id_division***, division_name, division_path_img)

> **ARCHIVEMENT**
> 
> (***id_archivement***, archivement_name, archivement_description, archivement_img_path)

> **MATCH**
> 
> (***id_match***, match_type, match_score, match_status, match_date)

> **MAP**
> 
> (***id_map***, map_name, map_file_path, map_description)

> **POWER_UP**
> 
> (***id_power_up***, power_up_description, power_up_file_path, power_up_icon)

> **FRIEND**
> 
> (***id_user_1*** \*, ***id_user_2*** \*)

> **BLOCKED**
> 
> (***id_user_1*** \*, ***id_user_2*** \*)

> **IS_MEMBER_OF**
> 
> (***id_user*** \*, ***id_channel*** \*, ***id_channel_member_status*** \*, date)

> **CHANNEL_MESSAGE**
> 
> (***id_user*** \*, ***id_channel*** \*, date, message_content)

> **PRIVATE_MESSAGE**
> 
> (***id_user_1*** \*, ***id_user_2*** \*, date, message_content)

> **RANKED**
> 
> (***id_user*** \*, ***id_division*** \*)

> **ARCHIVEMENT_DONE**
> 
> (***id_user*** \*, ***id_archivement*** \*, date)

> **PLAYED**
> 
> (***id_user_1*** \*, ***id_user_2*** \*, ***id_match*** \*)

> **PLAYED_ON**
> 
> (***id_match*** \*, ***id_map*** \*)

> **POWER_UP_SELECTED**
> 
> (***id_user*** \*, ***id_match*** \*, ***id_power_up*** \*)
