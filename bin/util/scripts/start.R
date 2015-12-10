#Install Rserve
install.packages('Rserve', repos='http://cran.r-project.org')

#Start Rserve
run.Rserve(debug = TRUE, 6311, args = NULL, config.file = "Rserv.conf")
