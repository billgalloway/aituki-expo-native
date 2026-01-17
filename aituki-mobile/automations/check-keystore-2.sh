#!/bin/bash
# Check keystore #2: @billgalloway__aituki-native_OLD_3.jks
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_3.jks" | grep SHA1

