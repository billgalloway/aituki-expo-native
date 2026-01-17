#!/bin/bash
# Check keystore #4: @billgalloway__aituki-native_OLD_1.jks
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_1.jks" | grep SHA1

