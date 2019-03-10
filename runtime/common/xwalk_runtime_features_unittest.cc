// Copyright (c) 2013 Intel Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "base/command_line.h"
#include "testing/gtest/include/gtest/gtest.h"
#include "xwalk/runtime/common/xwalk_runtime_features.h"
#include "content/public/test/test_utils.h"

TEST(XWalkRuntimeFeaturesTest, ValidateStableFeatures) {
  base::CommandLine cmd(base::CommandLine::NO_PROGRAM);
  xwalk::XWalkRuntimeFeatures::GetInstance()->Initialize(&cmd);
  EXPECT_TRUE(xwalk::XWalkRuntimeFeatures::isRawSocketsAPIEnabled());
}

TEST(XWalkRuntimeFeaturesTest, ValidateExperimentalFeatures) {
  base::CommandLine cmd(base::CommandLine::NO_PROGRAM);
  xwalk::XWalkRuntimeFeatures::GetInstance()->Initialize(&cmd);
  EXPECT_FALSE(xwalk::XWalkRuntimeFeatures::isDialogAPIEnabled());
}

TEST(XWalkRuntimeFeaturesTest, CommandLineOverrideDefaults) {
  base::CommandLine cmd(base::CommandLine::NO_PROGRAM);
  cmd.AppendSwitch("--enable-raw-sockets");
  xwalk::XWalkRuntimeFeatures::GetInstance()->Initialize(&cmd);
  EXPECT_TRUE(xwalk::XWalkRuntimeFeatures::isRawSocketsAPIEnabled());

  base::CommandLine cmd2 = base::CommandLine(base::CommandLine::NO_PROGRAM);
  cmd2.AppendSwitch("--disable-raw-sockets");
  xwalk::XWalkRuntimeFeatures::GetInstance()->Initialize(&cmd2);
  EXPECT_FALSE(xwalk::XWalkRuntimeFeatures::isRawSocketsAPIEnabled());
}

TEST(XWalkRuntimeFeaturesTest, CommandLineEnableExperimentalFeatures) {
  base::CommandLine cmd(base::CommandLine::NO_PROGRAM);
  cmd.AppendSwitch("--enable-xwalk-experimental-features");
  xwalk::XWalkRuntimeFeatures::GetInstance()->Initialize(&cmd);
  EXPECT_TRUE(xwalk::XWalkRuntimeFeatures::isRawSocketsAPIEnabled());
  EXPECT_TRUE(xwalk::XWalkRuntimeFeatures::isDialogAPIEnabled());

  base::CommandLine cmd2 = base::CommandLine(base::CommandLine::NO_PROGRAM);
  cmd2.AppendSwitch("--disable-raw-sockets");
  cmd2.AppendSwitch("--enable-xwalk-experimental-features");
  xwalk::XWalkRuntimeFeatures::GetInstance()->Initialize(&cmd2);
  EXPECT_TRUE(xwalk::XWalkRuntimeFeatures::isRawSocketsAPIEnabled());
  EXPECT_TRUE(xwalk::XWalkRuntimeFeatures::isDialogAPIEnabled());
}
