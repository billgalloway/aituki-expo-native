#!/bin/bash
# Check keystore #3: @billgalloway__aituki-native_OLD_2.jks
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_2.jks" | grep SHA1

