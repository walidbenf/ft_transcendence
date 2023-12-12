NAME			=	transcandance

all:	$(NAME)

clean:	down

fclean:	clean
	docker image rmi $(docker image ls -aq)
	docker volume rmi $(docker volume ls -aq)
	docker system prune -af

re:	fclean	all

$(NAME):	build up


build:
	docker-compose build

up:
	docker-compose up

down:
	docker-compose down