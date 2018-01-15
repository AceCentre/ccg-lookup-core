# Requirements

- node>=8.0.0

# How it works

```
$ npm install
$ ./gulp dev # start the development environment
$ ./gulp build # build for distribution
```

# Licence

This work is under a MIT licence. 


## Contributing

If you want to contribute to this project and make it better, your help is very welcome. You may want to update the services data - or update the code. 

### The services data

Take a look at the csv files in /ccg-lookup-core/tree/master/html/data and update at will. Note that only the files with ...-serviceType-CCG.csv are used by the system directly. The files in details are where the actual service-name contents are served from. You can update the spreadsheets and use a script at ccg-lookup-core/tree/master/scripts (e.g. /ccg-lookup-core/blob/master/scripts/details2md_ec.py ) to update these files. 

Update the files on a forked version then do a pull request:

### How to make a clean pull request

- Create a personal fork of the project on Github.
- Clone the fork on your local machine. Your remote repo on Github is called `origin`.
- Add the original repository as a remote called `upstream`.
- If you created your fork a while ago be sure to pull upstream changes into your local repository.
- Create a new branch to work on! Branch from `develop` if it exists, else from `master`.
- Implement/fix your feature, comment your code.
- Follow the code style of the project, including indentation.
- If the project has tests run them!
- Write or adapt tests as needed.
- Add or change the documentation as needed.
- Squash your commits into a single commit with git's [interactive rebase](https://help.github.com/articles/interactive-rebase). Create a new branch if necessary.
- Push your branch to your fork on Github, the remote `origin`.
- From your fork open a pull request in the correct branch. Target the project's `develop` branch if there is one, else go for `master`!
- ...
- Once the pull request is approved and merged you can pull the changes from `upstream` to your local repo and delete
your extra branch(es).

And last but not least: Always write your commit messages in the present tense. Your commit message should describe what the commit, when applied, does to the code – not what you did to the code.