
### Icon Cleaner

Giving credit to creatives is easier than ever! Icon Cleaner collects attribution details from icons obtained from the awesome [Noun Project](https://thenounproject.com/) and writes the data to a single file. Icon Cleaner also removes that information from the SVG and makes other aesthetic improvements to the SVG.

With a simple command, Icon Cleaner delivers nice, clean icons and a responsible way to attribute credit to the wonderful people who created them!

### Install

It's best to install icon_cleaner globally.

```{bash}
npm install icon_cleaner -g
```

### Usage

The CLI is quite simple. Run `node icon_cleaner` and specify the parent directory of your `icons` directory. Icon Cleaner will automatically look for the `icons` directory as an immediate sub-directory, so there is no need to specify it.

#### Examples

If your `icons` directory exists with your current working directory, just run `node icon_cleaner`:

```
node icon_cleaner
```

If your `icons` directory is a little deeper:

```{bash}
node icon_cleaner relative/path/to/directory
```

### Output

Icon Cleaner delivers two outputs. The first is a file in the parent directory named **attribution.txt**. It contains all of the attribution details needed to give credit where credit is due. The second output is a `dist` directory within `icons` that contains all of the revised icons.


Enjoy!
