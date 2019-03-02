import os

def getI():
    #In production:
    path = "/home/martin/OurServer/static/images"

    #Local:
    #path = "/home/martin/Documents/WebDevelopment/DjangoProjects/projects/server_release/OurServer/gallery/static/images"
    return(os.listdir(path))

