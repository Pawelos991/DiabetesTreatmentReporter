DROP TABLE IF EXISTS public.user CASCADE
;
DROP TABLE IF EXISTS public.role CASCADE
;
DROP TABLE IF EXISTS public.report CASCADE
;

CREATE TABLE public.role
(
    code char NOT NULL PRIMARY KEY,
    name varchar(30) NOT NULL
)
;

CREATE TABLE public.user
(
    id integer NOT NULL PRIMARY KEY,
    username varchar(255) NOT NULL,
    password varchar(256) NOT NULL,
    salt varchar(255) NOT NULL,
    user_role char NOT NULL,
    name varchar(255) NOT NULL,
    surname varchar(255) NOT NULL,
    doctor integer NULL,
    CONSTRAINT fk_role
        FOREIGN KEY(user_role)
            REFERENCES public.role(code),
    CONSTRAINT fk_doctor
        FOREIGN KEY(doctor)
            REFERENCES public.user(id)
)
;

COMMENT ON TABLE public.user
    IS 'Tabela przechowująca użytkowników systemu'
;

COMMENT ON COLUMN public.user.id
    IS 'Klucz główny'
;
COMMENT ON COLUMN public.user.username
    IS 'Nazwa użytkownika wykorzystywana przy logowaniu'
;
COMMENT ON COLUMN public.user.password
    IS 'Hash hasła użytkownika wykorzystywany przy logowaniu'
;
COMMENT ON COLUMN public.user.salt
    IS 'Sól użytkownika wykorzystywana przy logowaniu do sprawdzenia hasła'
;
COMMENT ON COLUMN public.user.user_role
    IS 'Rola użytkownika, klucz obcy z tabeli public.role'
;
COMMENT ON COLUMN public.user.name
    IS 'Imię użytkownika'
;
COMMENT ON COLUMN public.user.surname
    IS 'Nazwisko użytkownika'
;
COMMENT ON COLUMN public.user.doctor
    IS 'Identyfikator użytkownika, który jest lekarzem dla podanego użytkownika, jeśli użytkownik to pacjent. Klucz obcy tabeli public.user'
;

CREATE SEQUENCE public.user_seq
    AS INT START 1
    INCREMENT BY 1
    CYCLE;


CREATE TABLE public.report
(
    id integer NOT NULL PRIMARY KEY,
    user_id integer NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    avg_sugar_level integer NOT NULL,
    time_in_target integer NOT NULL,
    time_below_target integer NOT NULL,
    time_above_target integer NOT NULL,
    body_weight float NOT NULL,
    deleted boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES public.user(id)
)
;

COMMENT ON TABLE public.report
    IS 'Tabela przechowująca raporty użytkowników systemu'
;

COMMENT ON COLUMN public.report.id
    IS 'Klucz główny'
;
COMMENT ON COLUMN public.report.user_id
    IS 'Identyfikator użytkownika, który złożył raport, klucz obcy tabeli public.user'
;
COMMENT ON COLUMN public.report.year
    IS 'Rok okresu, którego dotyczy raport'
;
COMMENT ON COLUMN public.report.month
    IS 'Miesiąc okresu, którego dotyczy raport'
;
COMMENT ON COLUMN public.report.avg_sugar_level
    IS 'Średnie stężenie cukru w raportowanym okresie'
;
COMMENT ON COLUMN public.report.time_in_target
    IS 'Procentowa wartość czasu w zakresie (70-180 mg/dL)'
;
COMMENT ON COLUMN public.report.time_below_target
    IS 'Procentowa wartość czasu poniżej zakresu (70-180 mg/dL)'
;
COMMENT ON COLUMN public.report.time_above_target
    IS 'Procentowa wartość czasu powyżej zakresu (70-180 mg/dL)'
;
COMMENT ON COLUMN public.report.body_weight
    IS 'Masa ciała w momencie składania raportu, wyrażona w kg'
;
COMMENT ON COLUMN public.report.deleted
    IS 'Flaga mówiąca o tym, czy raport został usunięty poprzez dodanie nowego raportu za ten sam okres'
;

CREATE SEQUENCE public.report_seq
    AS INT START 1
    INCREMENT BY 1
    CYCLE;

CREATE INDEX users_reports_ids ON public.report (user_id);