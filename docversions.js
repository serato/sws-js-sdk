'use strict'

// `env` vars as defined by the Travis `artifacts` addon
const accessKeyId = process.env.ARTIFACTS_KEY
const secretAccessKey = process.env.ARTIFACTS_SECRET
const bucketName = process.env.ARTIFACTS_BUCKET
// `env` vars as defined by the Travis core
const repoName = process.env.TRAVIS_REPO_SLUG

const ignoreBranches = ['master', 'develop']

let AWS = require('aws-sdk')

AWS.config = new AWS.Config({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-1'
})

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

s3.listObjects({ 'Bucket': bucketName, 'Prefix': repoName }, function (err, data) {
  if (err) {
    console.log('ListObjects error', err)
  } else {
    let versions = []
    for (let obj of data.Contents) {
      let branchName = obj.Key.replace(repoName, '').split('/')[1]
      if (!versions.includes(branchName) && !ignoreBranches.includes(branchName)) {
        versions.push(branchName)
      }
    }

    if (versions.length > 0) {
      versions.sort()
      let versionObj = {}
      let i = 0
      for (let version of versions) {
        versionObj[i] = version
        i++
      }
      s3.putObject({
        'Bucket': bucketName,
        'Key': 'js/' + repoName.replace(/serato\//, '') + '.json',
        'Body': JSON.stringify(versionObj)
      }, function (err, data) {
        if (err) {
          console.log('PutObject error', err)
        } else {
          console.log(
            'Versioned documentation links generateed for ' + bucketName + '/' + repoName +
            ' for the following versions: ' + JSON.stringify(versionObj)
          )
        }
      })
    } else {
      console.log('No project versions found at s3://' + bucketName + '/' + repoName)
    }
  }
})
