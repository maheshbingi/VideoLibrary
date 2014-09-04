SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE DATABASE IF NOT EXISTS  VideoLibrary;
USE VideoLibrary;

CREATE TABLE IF NOT EXISTS `VideoLibrary`.`membership` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  `amount` FLOAT NULL,
  `max_movies` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`state` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `code` CHAR(2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`user_login` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(45) NOT NULL,
  `is_disabled` boolean default 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `street` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `state_id` INT NOT NULL,
  `zip_code` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `StateId_idx` (`state_id` ASC),
  CONSTRAINT `StateId`
    FOREIGN KEY (`state_id`)
    REFERENCES `VideoLibrary`.`state` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`person` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `ssn` VARCHAR(45) NOT NULL,
  `membership_type_id` INT NOT NULL,
  `street` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `state_id` INT NOT NULL,
  `zip_code` VARCHAR(45) NOT NULL,
  `user_login_id` INT NOT NULL,
  `membership_id` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `MembershipTypeId_idx` (`membership_type_id` ASC),
  CONSTRAINT `MembershipTypeId_Person`
    FOREIGN KEY (`membership_type_id`)
    REFERENCES `VideoLibrary`.`membership` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `StateId_Person`
    FOREIGN KEY (`state_id`)
    REFERENCES `VideoLibrary`.`state` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UserLoginId_Person`
    FOREIGN KEY (`user_login_id`)
    REFERENCES `VideoLibrary`.`user_login` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`bill_payment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `person_id` INT NOT NULL,
  `amount` FLOAT NOT NULL DEFAULT 0,
  `payment_date` TIMESTAMP NOT NULL,
  CONSTRAINT `PersonId_Payment`
    FOREIGN KEY (`person_id`)
    REFERENCES `VideoLibrary`.`person` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	PRIMARY KEY (`id`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`movies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NULL,
  `banner` VARCHAR(200) NULL,
  `release_date` INTEGER(4),
  `rent_amount` FLOAT NOT NULL DEFAULT 0.00,
  `available_copies` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL UNIQUE,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`issued_movies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `person_id` INT NOT NULL,
  `movie_id` INT NOT NULL,
  `issued_date` TIMESTAMP NOT NULL,
  `submitted_date` TIMESTAMP NULL,
  `is_paid` boolean default 0,
  INDEX `PersonId_idx` (`person_id` ASC),
  INDEX `MovieId_idx` (`movie_id` ASC),
  CONSTRAINT `PersonId_Movies`
    FOREIGN KEY (`person_id`)
    REFERENCES `VideoLibrary`.`person` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MovieId`
    FOREIGN KEY (`movie_id`)
    REFERENCES `VideoLibrary`.`movies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
	PRIMARY KEY (`id`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `VideoLibrary`.`movie_categories` (
  `movie_id` INT NULL,
  `category_id` INT NULL,
  INDEX `CategoryId_idx` (`category_id` ASC),
  INDEX `MovieId_idx` (`movie_id` ASC),
  CONSTRAINT `CategoryId`
    FOREIGN KEY (`category_id`)
    REFERENCES `VideoLibrary`.`category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MovieId_Movie_Categories`
    FOREIGN KEY (`movie_id`)
    REFERENCES `VideoLibrary`.`movies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


insert into state (code,name) values ('AL','Alabama');
insert into state (code,name) values ('AK','Alaska');
insert into state (code,name) values ('AS','American Samoa');
insert into state (code,name) values ('AZ','Arizona');
insert into state (code,name) values ('AR','Arkansas');
insert into state (code,name) values ('CA','California');
insert into state (code,name) values ('CO','Colorado');
insert into state (code,name) values ('CT','Connecticut');
insert into state (code,name) values ('DE','Delaware');
insert into state (code,name) values ('DC','District of Columbia');
insert into state (code,name) values ('FM','Federated States of Micronesia');
insert into state (code,name) values ('FL','Florida');
insert into state (code,name) values ('GA','Georgia');
insert into state (code,name) values ('GU','Guam');
insert into state (code,name) values ('HI','Hawaii');
insert into state (code,name) values ('ID','Idaho');
insert into state (code,name) values ('IL','Illinois');
insert into state (code,name) values ('IN','Indiana');
insert into state (code,name) values ('IA','Iowa');
insert into state (code,name) values ('KS','Kansas');
insert into state (code,name) values ('KY','Kentucky');
insert into state (code,name) values ('LA','Louisiana');
insert into state (code,name) values ('ME','Maine');
insert into state (code,name) values ('MH','Marshall Islands');
insert into state (code,name) values ('MD','Maryland');
insert into state (code,name) values ('MA','Massachusetts');
insert into state (code,name) values ('MI','Michigan');
insert into state (code,name) values ('MN','Minnesota');
insert into state (code,name) values ('MS','Mississippi');
insert into state (code,name) values ('MO','Missouri');
insert into state (code,name) values ('MT','Montana');
insert into state (code,name) values ('NE','Nebraska');
insert into state (code,name) values ('NV','Nevada');
insert into state (code,name) values ('NH','New Hampshire');
insert into state (code,name) values ('NJ','New Jersey');
insert into state (code,name) values ('NM','New Mexico');
insert into state (code,name) values ('NY','New York');
insert into state (code,name) values ('NC','North Carolina');
insert into state (code,name) values ('ND','North Dakota');
insert into state (code,name) values ('MP','Northern Mariana Islands');
insert into state (code,name) values ('OH','Ohio');
insert into state (code,name) values ('OK','Oklahoma');
insert into state (code,name) values ('OR','Oregon');
insert into state (code,name) values ('PW','Palau');
insert into state (code,name) values ('PA','Pennsylvania');
insert into state (code,name) values ('PR','Puerto Rico');
insert into state (code,name) values ('RI','Rhode Island');
insert into state (code,name) values ('SC','South Carolina');
insert into state (code,name) values ('SD','South Dakota');
insert into state (code,name) values ('TN','Tennessee');
insert into state (code,name) values ('TX','Texas');
insert into state (code,name) values ('UT','Utah');
insert into state (code,name) values ('VT','Vermont');
insert into state (code,name) values ('VI','Virgin Islands');
insert into state (code,name) values ('VA','Virginia');
insert into state (code,name) values ('WA','Washington');
insert into state (code,name) values ('WV','West Virginia');
insert into state (code,name) values ('WI','Wisconsin');
insert into state (code,name) values ('WY','Wyoming');


insert into membership (id, type, amount, max_movies) values (1, 'Simple Customer', 0, 2);
insert into membership (id, type, amount, max_movies) values (2, 'Premium Member', 10, 10);


insert into user_login (email, password) values('admin@admin.com', '1234');


INSERT INTO category(id, name) VALUES (1, 'Action');
INSERT INTO category(id, name) VALUES (2, 'Adult');
INSERT INTO category(id, name) VALUES (3, 'Adventure');
INSERT INTO category(id, name) VALUES (4, 'Animation');
INSERT INTO category(id, name) VALUES (5, 'Biography');
INSERT INTO category(id, name) VALUES (6, 'Comedy');
INSERT INTO category(id, name) VALUES (7, 'Crime');
INSERT INTO category(id, name) VALUES (8, 'Documentary');
INSERT INTO category(id, name) VALUES (9, 'Drama');
INSERT INTO category(id, name) VALUES (10, 'Family');
INSERT INTO category(id, name) VALUES (11, 'Fantasy');
INSERT INTO category(id, name) VALUES (12, 'Film-Noir');
INSERT INTO category(id, name) VALUES (13, 'Game-Show');
INSERT INTO category(id, name) VALUES (14, 'Hindi');
INSERT INTO category(id, name) VALUES (15, 'History');
INSERT INTO category(id, name) VALUES (16, 'Horror');
INSERT INTO category(id, name) VALUES (17, 'Lifestyle');
INSERT INTO category(id, name) VALUES (18, 'Music');
INSERT INTO category(id, name) VALUES (19, 'Musical');
INSERT INTO category(id, name) VALUES (20, 'Mystery');
INSERT INTO category(id, name) VALUES (21, 'News');
INSERT INTO category(id, name) VALUES (22, 'Reality-TV');
INSERT INTO category(id, name) VALUES (23, 'Romance');
INSERT INTO category(id, name) VALUES (24, 'Sci-Fi');
INSERT INTO category(id, name) VALUES (25, 'Short');
INSERT INTO category(id, name) VALUES (26, 'Sport');
INSERT INTO category(id, name) VALUES (27, 'Talk-Show');
INSERT INTO category(id, name) VALUES (28, 'Thriller');
INSERT INTO category(id, name) VALUES (29, 'War');
INSERT INTO category(id, name) VALUES (30, 'Western');


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
