from thefuzz import process
import argparse
import json

# check for cl args
parser = argparse.ArgumentParser("installed_apps")
parser.add_argument("search_query", help="the app being searched for", type=str)
parser.add_argument("installed_apps", help="where installed app info is serialized", type=str)
args = parser.parse_args()

# read installed apps
with open(args.installed_apps, "r") as json_file:
    apps = json.load(json_file)

sim_sorted_apps = process.extract(args.search_query, list(apps.keys()))
for app, score in sim_sorted_apps:
    print(f"{app}: {score}; {apps[app]['icon_path']}")

