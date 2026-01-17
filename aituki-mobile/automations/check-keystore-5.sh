#!/bin/bash
# Check keystore #5: @billgalloway__aituki-native.jks
keytool -list -v -keystore "@billgalloway__aituki-native.jks" | grep SHA1

