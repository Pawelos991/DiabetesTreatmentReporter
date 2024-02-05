INSERT INTO public.role(code, name) VALUES ('A', 'Administrator');
INSERT INTO public.role(code, name) VALUES ('D', 'Doctor');
INSERT INTO public.role(code, name) VALUES ('P', 'Patient');

INSERT INTO public.user(id, username, password, salt, user_role, name, surname)
VALUES (nextval('public.user_seq'),
        'admin',
        'e86d8bf7e1023c013c7d77643817358081163fe6b5c86be364f0ac6c43c72e11',
        'admin',
        'A',
        'admin',
        'admin'
        );