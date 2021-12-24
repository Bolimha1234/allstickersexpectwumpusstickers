from apnggif import apnggif
import sys, os

gif = sys.argv[1:][0]
apnggif(gif)
os.remove(gif)