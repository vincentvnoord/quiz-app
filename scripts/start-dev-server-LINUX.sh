DOTNET_API_DIR="../api/Api"
NEXTJS_DIR="../frontend"
DOCKER_COMPOSE_DIR="../"

gnome-terminal -- bash -c "
  gnome-terminal --tab --title='Dotnet API' -- bash -c 'cd \"$DOTNET_API_DIR\" && dotnet watch run; exec bash' &
  gnome-terminal --tab --title='Next.js Frontend' -- bash -c 'cd \"$NEXTJS_DIR\" && npm run dev; exec bash' &
  gnome-terminal --tab --title='Postgres' -- bash -c 'cd \"$DOCKER_COMPOSE_DIR\" && docker compose up; exec bash'
"