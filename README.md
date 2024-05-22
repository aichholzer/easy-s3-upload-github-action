
Easy S3 uploader for Github Actions.

You can upload files or directories to any S3 compatible cloud buckets.

## Usage

See the following example.

```YAML
# inside .github/workflows/action.yml
name: Add File to Bucket
on: push

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@master

      - name: Upload file to bucket
        uses: axazara/easy-s3-upload-github-action@main
        env:
          SOURCE: ./releases/
          S3_ENDPOINT: 'xxxx.r2.cloudflarestorage.com/xxxx'
          S3_BUCKET: ${{ secrets.S3_BUCKET }}
          S3_ACCESS_KEY_ID: ${{ secrets.S3_ACCESS_KEY_ID }}
          S3_SECRET_ACCESS_KEY: ${{ secrets.S3_SECRET_ACCESS_KEY }}
          S3_ACL: 'public-read'
          S3_PREFIX: 'releases/'
          VERBOSE: yes
```
